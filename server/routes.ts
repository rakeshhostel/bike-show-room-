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
  try {
    await setupAuth(app);
    registerAuthRoutes(app);
  } catch (err) {
    console.warn("Retrying Replit Auth setup failed (likely due to missing REPL_ID or network), skipping auth...", err);
  }

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




  return httpServer;
}


