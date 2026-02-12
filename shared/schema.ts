import { pgTable, text, serial, integer, boolean, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
// Import auth models
export * from "./models/auth";

export const bikes = pgTable("bikes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(), // Ex-showroom price
  year: integer("year").notNull(),
  cc: integer("cc").notNull(),
  mileage: text("mileage"),
  transmission: text("transmission"),
  power: text("power"),
  torque: text("torque"),
  topSpeed: text("top_speed"),
  fuelType: text("fuel_type"),
  abs: text("abs"),
  weight: text("weight"),
  tankCapacity: text("tank_capacity"),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("0"),
  imageUrl: text("image_url").notNull(),
  brand: text("brand").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'Trending', 'Popular', 'Electric', 'Upcoming', 'Standard'
  availableColors: jsonb("available_colors").$type<string[]>(),
});

export const insertBikeSchema = createInsertSchema(bikes).omit({ id: true });

export type Bike = typeof bikes.$inferSelect;
export type InsertBike = z.infer<typeof insertBikeSchema>;

export type BikeCategory = 'Trending' | 'Popular' | 'Electric' | 'Upcoming' | 'Standard';

// API Types
export type BikeFilterParams = {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minCC?: number;
  maxCC?: number;
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'latest';
};
