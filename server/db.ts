import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL must be set. Did you forget to provision a database? Using dummy connection to allow server startup.");
}


export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/db" });
export const db = drizzle(pool, { schema });
