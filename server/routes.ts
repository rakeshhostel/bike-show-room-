import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import session from "express-session";
import passport from "passport";
import MemoryStore from "memorystore";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup auth — only load Replit Auth when running on Replit (REPL_ID is set)
  // On Render/production without REPL_ID, just set up basic session middleware
  if (process.env.REPL_ID) {
    try {
      const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
      await setupAuth(app);
      registerAuthRoutes(app);
    } catch (err) {
      console.warn("Replit Auth setup failed, skipping...", err);
    }
  } else {
    // Basic session + passport setup without Replit OIDC
    const sessionTtl = 7 * 24 * 60 * 60 * 1000;
    const MemStore = MemoryStore(session);
    app.set("trust proxy", 1);
    app.use(session({
      secret: process.env.SESSION_SECRET || "bike-showroom-secret",
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

  // API Routes
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
    if (isNaN(id)) {
      return res.status(404).json({ message: "Bike not found" });
    }
    const bike = await storage.getBike(id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json(bike);
  });

  app.post(api.bikes.create.path, async (req, res) => {
    // ... same as before
  });

  // Review Routes
  app.get(api.reviews.list.path, async (req, res) => {
    const bikeId = parseInt(req.params.bikeId);
    if (isNaN(bikeId)) return res.status(400).json({ message: "Invalid bike ID" });
    const reviews = await storage.getReviews(bikeId);
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      const bikeId = parseInt(req.params.bikeId);
      const input = api.reviews.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const review = await storage.createReview({ ...input, bikeId, userId });
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  return httpServer;
}
