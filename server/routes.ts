import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // API Routes
  app.get(api.bikes.list.path, async (req, res) => {
    try {
      // Parse query params using the schema, but express query params are strings
      // so we rely on z.coerce in the schema to handle conversions if needed,
      // or manual parsing if the schema didn't use coerce.
      // In shared/routes.ts I used z.coerce.number() so this should work.
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

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingBikes = await storage.getBikes();
  if (existingBikes.length === 0) {
    const bikesToSeed = [
      {
        name: "Yamaha R15 V4",
        price: 182000,
        year: 2024,
        cc: 155,
        mileage: "45 kmpl",
        transmission: "6 Speed",
        power: "18.4 PS",
        torque: "14.2 Nm",
        topSpeed: "140 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "142 kg",
        tankCapacity: "11 L",
        rating: "4.5",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/115827/r15-v4-right-front-three-quarter-3.jpeg?isig=0",
        brand: "Yamaha",
        category: "Trending",
        description: "The Yamaha R15 V4 is a sports bike available in 5 variants and 5 colours. It is powered by a 155cc BS6 engine.",
        availableColors: ["Racing Blue", "Metallic Red", "Dark Knight"],
      },
      {
        name: "Royal Enfield Classic 350",
        price: 193000,
        year: 2024,
        cc: 349,
        mileage: "35 kmpl",
        transmission: "5 Speed",
        power: "20.2 PS",
        torque: "27 Nm",
        topSpeed: "114 kmph",
        fuelType: "Petrol",
        abs: "Single/Dual Channel",
        weight: "195 kg",
        tankCapacity: "13 L",
        rating: "4.7",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/49673/classic-350-right-front-three-quarter-11.jpeg?isig=0",
        brand: "Royal Enfield",
        category: "Popular",
        description: "The Classic 350 is Royal Enfield's best-selling model, known for its retro styling and thumping exhaust note.",
        availableColors: ["Redditch Red", "Halcyon Green", "Signals Marsh Grey"],
      },
      {
        name: "KTM Duke 390",
        price: 311000,
        year: 2024,
        cc: 399,
        mileage: "28 kmpl",
        transmission: "6 Speed",
        power: "46 PS",
        torque: "39 Nm",
        topSpeed: "167 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel with Supermoto Mode",
        weight: "168 kg",
        tankCapacity: "15 L",
        rating: "4.6",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/144673/390-duke-right-front-three-quarter-3.jpeg?isig=0",
        brand: "KTM",
        category: "Trending",
        description: "The KTM 390 Duke is a naked streetfighter that offers thrilling performance and sharp handling.",
        availableColors: ["Electronic Orange", "Atlantic Blue"],
      },
      {
        name: "Kawasaki Ninja 300",
        price: 343000,
        year: 2024,
        cc: 296,
        mileage: "30 kmpl",
        transmission: "6 Speed",
        power: "39 PS",
        torque: "26.1 Nm",
        topSpeed: "160 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "179 kg",
        tankCapacity: "17 L",
        rating: "4.4",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/115457/ninja-300-right-front-three-quarter-2.jpeg?isig=0",
        brand: "Kawasaki",
        category: "Standard",
        description: "The Ninja 300 is the most affordable twin-cylinder sports bike from Kawasaki in India.",
        availableColors: ["Lime Green", "Candy Lime Green", "Ebony"],
      },
      {
        name: "TVS Apache RR 310",
        price: 272000,
        year: 2024,
        cc: 312,
        mileage: "30 kmpl",
        transmission: "6 Speed",
        power: "34 PS",
        torque: "27.3 Nm",
        topSpeed: "160 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "174 kg",
        tankCapacity: "11 L",
        rating: "4.6",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/96231/apache-rr-310-right-front-three-quarter-2.jpeg?isig=0",
        brand: "TVS",
        category: "Popular",
        description: "TVS Apache RR 310 is a flagship sports bike with aerodynamic design and premium features.",
        availableColors: ["Racing Red", "Titanium Black"],
      },
      {
        name: "Honda CBR 650R",
        price: 935000,
        year: 2024,
        cc: 649,
        mileage: "20 kmpl",
        transmission: "6 Speed",
        power: "87 PS",
        torque: "57.5 Nm",
        topSpeed: "220 kmph",
        fuelType: "Petrol",
        abs: "Dual Channel",
        weight: "211 kg",
        tankCapacity: "15.4 L",
        rating: "4.8",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/52975/cbr-650r-right-front-three-quarter-3.jpeg?isig=0",
        brand: "Honda",
        category: "Premium",
        description: "The CBR650R is a middleweight sports bike with an inline-four engine.",
        availableColors: ["Grand Prix Red", "Matte Gunpowder Black Metallic"],
      },
      {
        name: "Ather 450X",
        price: 138000,
        year: 2024,
        cc: 0,
        mileage: "111 km/charge",
        transmission: "Automatic",
        power: "6.4 kW",
        torque: "26 Nm",
        topSpeed: "90 kmph",
        fuelType: "Electric",
        abs: "CBS",
        weight: "111.6 kg",
        tankCapacity: "N/A",
        rating: "4.4",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/125203/450x-gen-3-right-front-three-quarter.jpeg?isig=0",
        brand: "Ather",
        category: "Electric",
        description: "Ather 450X is a premium electric scooter known for its performance and smart features.",
        availableColors: ["Space Grey", "Mint Green", "White"],
      },
      {
        name: "Ultraviolette F77",
        price: 380000,
        year: 2024,
        cc: 0,
        mileage: "307 km/charge",
        transmission: "Automatic",
        power: "30 kW",
        torque: "100 Nm",
        topSpeed: "152 kmph",
        fuelType: "Electric",
        abs: "Dual Channel",
        weight: "207 kg",
        tankCapacity: "N/A",
        rating: "4.7",
        imageUrl: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/136013/f77-right-front-three-quarter.jpeg?isig=0",
        brand: "Ultraviolette",
        category: "Electric",
        description: "India's first high-performance electric motorcycle with futuristic design.",
        availableColors: ["Airstrike", "Shadow", "Laser"],
      }
    ];

    for (const bike of bikesToSeed) {
      await storage.createBike(bike);
    }
  }
}
