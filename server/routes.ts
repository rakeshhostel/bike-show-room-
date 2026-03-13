import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check — must respond immediately for Render deployment to succeed
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  // ── Session & Passport setup ──────────────────────────────────────────────
  if (process.env.REPL_ID) {
    try {
      const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
      await setupAuth(app);
      registerAuthRoutes(app);
    } catch (err) {
      console.warn("Replit Auth setup failed, skipping...", err);
    }
  } else {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000;
    const MemStore = MemoryStore(session);
    app.set("trust proxy", 1);
    app.use(session({
      secret: process.env.SESSION_SECRET || "bike-showroom-secret-key",
      store: new MemStore({ checkPeriod: 86400000 }),
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: false, maxAge: sessionTtl },
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: any, cb) => cb(null, user));
    passport.deserializeUser((user: any, cb) => cb(null, user));
  }

  // ── Google OAuth Strategy ─────────────────────────────────────────────────
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || "";
        const name = profile.displayName || "Google User";
        const googleId = profile.id;
        const photo = profile.photos?.[0]?.value || null;

        // Check if user already exists by Google ID
        let user = await storage.getUserByGoogleId(googleId);
        if (!user) {
          // Check if email already registered (link accounts)
          user = await storage.getUserByEmail(email);
          if (user) {
            // Upgrade existing email/pass account with Google ID
            user = await storage.setGoogleId(user.id, googleId, photo);
          } else {
            // Brand new user via Google
            user = await storage.createGoogleUser({
              id: randomUUID(),
              name,
              email,
              googleId,
              profileImageUrl: photo,
            });
          }
        }
        return done(null, { id: user!.id, name, email, photo });
      } catch (err) {
        return done(err as Error);
      }
    }
  ));

  // Google OAuth — start flow
  app.get("/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  // Google OAuth — callback
  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login?error=google_failed" }),
    (req, res) => {
      const user = req.user as any;
      if (user) {
        (req.session as any).userId = user.id;
        (req.session as any).userName = user.name;
        (req.session as any).userEmail = user.email;
        (req.session as any).userPhoto = user.photo;
      }
      res.redirect("/");
    }
  );

  // ─── Email/Password Auth Routes ───────────────────────────────────────────

  // Register
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        id: randomUUID(),
        name,
        email,
        passwordHash,
      });
      (req.session as any).userId = user.id;
      (req.session as any).userName = name;
      (req.session as any).userEmail = email;
      return res.status(201).json({ id: user.id, name, email });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const passwordHash = (user as any).passwordHash;
      if (!passwordHash) {
        return res.status(401).json({ message: "This email was registered with Google. Please use Google Sign-In." });
      }
      const valid = await bcrypt.compare(password, passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      (req.session as any).userId = user.id;
      (req.session as any).userName = (user as any).name || (user as any).firstName || email.split("@")[0];
      (req.session as any).userEmail = email;
      return res.json({ id: user.id, name: (req.session as any).userName, email });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    const session = req.session as any;
    if (!session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.json({
      id: session.userId,
      name: session.userName,
      email: session.userEmail,
      photo: session.userPhoto || null,
    });
  });

  // ─── Bike Routes ───────────────────────────────────────────────────────────
  app.get(api.bikes.list.path, async (req, res) => {
    try {
      const filters = api.bikes.list.input?.parse(req.query);
      const bikes = await storage.getBikes(filters);
      res.json(bikes);
    } catch (err) {
      console.error("Error fetching bikes:", err);
      res.status(400).json({ message: "Invalid filter parameters" });
    }
  });

  app.get(api.bikes.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(404).json({ message: "Bike not found" });
    const bike = await storage.getBike(id);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    res.json(bike);
  });

  app.post(api.bikes.create.path, async (req, res) => {
    // placeholder
  });

  // ─── Review Routes ─────────────────────────────────────────────────────────
  app.get(api.reviews.list.path, async (req, res) => {
    const bikeId = parseInt(req.params.bikeId);
    if (isNaN(bikeId)) return res.status(400).json({ message: "Invalid bike ID" });
    const reviews = await storage.getReviews(bikeId);
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const bikeId = parseInt(req.params.bikeId);
      if (isNaN(bikeId)) return res.status(400).json({ message: "Invalid bike ID" });

      const session = req.session as any;
      const { rating, comment, guestName } = req.body;

      if (!rating || !comment) {
        return res.status(400).json({ message: "Rating and comment are required" });
      }
      if (comment.length < 5) {
        return res.status(400).json({ message: "Comment must be at least 5 characters" });
      }

      const reviewerName = session.userName || guestName || "Anonymous";
      const userId = session.userId || null;

      const review = await storage.createReview({
        bikeId,
        userId,
        rating: Number(rating),
        comment,
        reviewerName,
      } as any);

      res.status(201).json(review);
    } catch (err) {
      console.error("Review error:", err);
      res.status(400).json({ message: "Failed to submit review" });
    }
  });

  // ─── ADMIN ROUTES ──────────────────────────────────────────────────────────
  const ADMIN_EMAIL = "rrakesh20235@gmail.com";
  const ADMIN_PASSWORD = "9390389606Rake@";

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!(req.session as any).isAdmin) {
      return res.status(401).json({ message: "Admin access required" });
    }
    next();
  };

  app.post("/api/admin/login", async (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      (req.session as any).isAdmin = true;
      return res.json({ message: "Admin logged in" });
    }
    return res.status(401).json({ message: "Invalid admin credentials" });
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).isAdmin = false;
    res.json({ message: "Logged out" });
  });

  app.get("/api/admin/me", (req, res) => {
    if ((req.session as any).isAdmin) {
      return res.json({ isAdmin: true });
    }
    return res.status(401).json({ message: "Not admin" });
  });

  app.get("/api/admin/bikes", requireAdmin, async (req, res) => {
    const bikes = await storage.getBikes({});
    res.json(bikes);
  });

  app.post("/api/admin/bikes", requireAdmin, async (req, res) => {
    try {
      const { name, brand, category, price, year, cc, imageUrl, description,
        mileage, transmission, power, torque, topSpeed, fuelType, abs,
        weight, tankCapacity, rating, availableColors } = req.body;

      if (!name || !brand || !category || !price || !year || !cc || !imageUrl) {
        return res.status(400).json({ message: "Name, brand, category, price, year, CC and image URL are required" });
      }

      const colors = typeof availableColors === "string"
        ? availableColors.split(",").map((c: string) => c.trim()).filter(Boolean)
        : availableColors || [];

      const bike = await storage.createBike({
        name, brand, category,
        price: Number(price), year: Number(year), cc: Number(cc),
        imageUrl, description: description || null,
        mileage: mileage || null, transmission: transmission || null,
        power: power || null, torque: torque || null,
        topSpeed: topSpeed || null, fuelType: fuelType || "Petrol",
        abs: abs || null, weight: weight || null,
        tankCapacity: tankCapacity || null,
        rating: rating || "4.0",
        availableColors: colors,
      } as any);

      res.status(201).json(bike);
    } catch (err: any) {
      console.error("Admin add bike error:", err);
      res.status(500).json({ message: "Failed to add bike" });
    }
  });

  app.delete("/api/admin/bikes/:id", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const deleted = await storage.deleteBike(id);
    if (!deleted) return res.status(404).json({ message: "Bike not found" });
    res.json({ message: "Bike deleted" });
  });

  app.patch("/api/admin/bikes/:id/sold", requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { sold } = req.body;
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const bike = await storage.markSold(id, Boolean(sold));
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    res.json(bike);
  });

  return httpServer;
}
