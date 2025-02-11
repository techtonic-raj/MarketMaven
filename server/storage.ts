import { startupIdeas, type StartupIdea, type InsertStartupIdea } from "@shared/schema";

export interface IStorage {
  createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea>;
  getStartupIdea(id: number): Promise<StartupIdea | undefined>;
  getAllStartupIdeas(): Promise<StartupIdea[]>;
  updateStartupIdeaStatus(id: number, status: string): Promise<StartupIdea | undefined>;
}

export class MemStorage implements IStorage {
  private ideas: Map<number, StartupIdea>;
  private currentId: number;

  constructor() {
    this.ideas = new Map();
    this.currentId = 1;
  }

  async createStartupIdea(idea: InsertStartupIdea): Promise<StartupIdea> {
    const id = this.currentId++;
    const newIdea: StartupIdea = {
      ...idea,
      id,
      status: "pending",
      submittedAt: new Date(),
    };
    this.ideas.set(id, newIdea);
    return newIdea;
  }

  async getStartupIdea(id: number): Promise<StartupIdea | undefined> {
    return this.ideas.get(id);
  }

  async getAllStartupIdeas(): Promise<StartupIdea[]> {
    return Array.from(this.ideas.values());
  }

  async updateStartupIdeaStatus(id: number, status: string): Promise<StartupIdea | undefined> {
    const idea = this.ideas.get(id);
    if (!idea) return undefined;
    
    const updatedIdea = { ...idea, status };
    this.ideas.set(id, updatedIdea);
    return updatedIdea;
  }
}

export const storage = new MemStorage();
