import { type User, type UpsertUser } from "@shared/models/auth";

// Interface for auth storage operations
// (IMPORTANT) These user operations are mandatory for Replit Auth.
export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
}

// In-memory auth storage — used when DATABASE_URL is not set (e.g. on Render)
class MemAuthStorage implements IAuthStorage {
  private users = new Map<string, User>();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id as string;
    const existing = this.users.get(id);
    const user: User = {
      ...userData,
      id,
      createdAt: existing?.createdAt ?? new Date(),
      updatedAt: new Date(),
    } as User;
    this.users.set(id, user);
    return user;
  }
}

export const authStorage = new MemAuthStorage();
