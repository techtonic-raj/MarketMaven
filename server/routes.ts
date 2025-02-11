import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStartupIdeaSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/startup-ideas", async (req, res) => {
    try {
      const validatedData = insertStartupIdeaSchema.parse(req.body);
      const idea = await storage.createStartupIdea(validatedData);
      res.status(201).json(idea);
    } catch (error) {
      res.status(400).json({ error: "Invalid startup idea data" });
    }
  });

  app.get("/api/startup-ideas", async (_req, res) => {
    const ideas = await storage.getAllStartupIdeas();
    res.json(ideas);
  });

  app.get("/api/startup-ideas/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const idea = await storage.getStartupIdea(id);
    
    if (!idea) {
      res.status(404).json({ error: "Startup idea not found" });
      return;
    }
    
    res.json(idea);
  });

  app.patch("/api/startup-ideas/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const updatedIdea = await storage.updateStartupIdeaStatus(id, status);
    
    if (!updatedIdea) {
      res.status(404).json({ error: "Startup idea not found" });
      return;
    }
    
    res.json(updatedIdea);
  });

  const httpServer = createServer(app);
  return httpServer;
}
