import { db } from "./db";
import { bikes, reviews, type Bike, type InsertBike, type BikeFilterParams, type Review, type InsertReview } from "@shared/schema";
import { eq, and, gte, lte, like, desc, asc, ilike } from "drizzle-orm";
// Auth storage is imported from separate module
import { authStorage, type IAuthStorage } from "./replit_integrations/auth";

export interface IStorage extends IAuthStorage {
  // Bike operations
  getBikes(filters?: BikeFilterParams): Promise<Bike[]>;
  getBike(id: number): Promise<Bike | undefined>;
  createBike(bike: InsertBike): Promise<Bike>;
  // Review operations
  getReviews(bikeId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // ... existing auth methods ...
  getUser = authStorage.getUser;
  upsertUser = authStorage.upsertUser;

  async getBikes(filters?: BikeFilterParams): Promise<Bike[]> {
    let query = db.select().from(bikes);
    const conditions = [];

    if (filters) {
      if (filters.brand) {
        conditions.push(eq(bikes.brand, filters.brand));
      }
      if (filters.minPrice) {
        conditions.push(gte(bikes.price, filters.minPrice));
      }
      if (filters.maxPrice) {
        conditions.push(lte(bikes.price, filters.maxPrice));
      }
      if (filters.minCC) {
        conditions.push(gte(bikes.cc, filters.minCC));
      }
      if (filters.maxCC) {
        conditions.push(lte(bikes.cc, filters.maxCC));
      }
      if (filters.category) {
        conditions.push(eq(bikes.category, filters.category));
      }
      if (filters.search) {
        conditions.push(ilike(bikes.name, `%${filters.search}%`));
      }
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    if (filters?.sort) {
      if (filters.sort === 'price_asc') {
        query = query.orderBy(asc(bikes.price)) as any;
      } else if (filters.sort === 'price_desc') {
        query = query.orderBy(desc(bikes.price)) as any;
      } else if (filters.sort === 'latest') {
        query = query.orderBy(desc(bikes.year)) as any;
      }
    }

    return await query;
  }

  async getBike(id: number): Promise<Bike | undefined> {
    const [bike] = await db.select().from(bikes).where(eq(bikes.id, id));
    return bike;
  }

  async createBike(insertBike: InsertBike): Promise<Bike> {
    const [bike] = await db.insert(bikes).values(insertBike).returning();
    return bike;
  }

  // Review implementation
  async getReviews(bikeId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.bikeId, bikeId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }
}

export const storage = new DatabaseStorage();
