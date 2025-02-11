import { startupIdeas, type StartupIdea, type InsertStartupIdea } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea>;
  getStartupIdea(id: number): Promise<StartupIdea | undefined>;
  getAllStartupIdeas(): Promise<StartupIdea[]>;
  updateStartupIdeaStatus(id: number, status: string): Promise<StartupIdea | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea> {
    const [newIdea] = await db
      .insert(startupIdeas)
      .values(idea)
      .returning();
    return newIdea;
  }

  async getStartupIdea(id: number): Promise<StartupIdea | undefined> {
    const [idea] = await db
      .select()
      .from(startupIdeas)
      .where(eq(startupIdeas.id, id));
    return idea;
  }

  async getAllStartupIdeas(): Promise<StartupIdea[]> {
    return await db.select().from(startupIdeas);
  }

  async updateStartupIdeaStatus(id: number, status: string): Promise<StartupIdea | undefined> {
    const [updatedIdea] = await db
      .update(startupIdeas)
      .set({ status })
      .where(eq(startupIdeas.id, id))
      .returning();
    return updatedIdea;
  }
}

export const storage = new DatabaseStorage();