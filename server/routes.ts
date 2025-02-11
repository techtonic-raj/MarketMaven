import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStartupIdeaSchema } from "@shared/schema";
import fetch from "node-fetch";
import snoowrap from "snoowrap";
import type { Submission } from "snoowrap";

interface MarketDataResponse {
  MarketCapitalization?: string;
  GrowthRate?: string;
  Industry?: string;
}

interface CompetitorData {
  name: string;
  marketShare: number;
  stockPrice?: number;
}

interface MarketAnalysis {
  marketSize: string;
  growthRate: string;
  competitors: CompetitorData[];
  revenueProjections: Array<{
    year: number;
    revenue: number;
  }>;
}

interface RedditAnalysis {
  overallSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topPosts: Array<{
    title: string;
    url: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }>;
  keywords: Array<{
    text: string;
    count: number;
    sentiment: number;
  }>;
}

// Initialize Reddit API client
const reddit = new snoowrap({
  userAgent: 'market-validator-app',
  clientId: process.env.REDDIT_CLIENT_ID || '',
  clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
  refreshToken: process.env.REDDIT_REFRESH_TOKEN || '',
});

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

  app.get("/api/market-data/:industry", async (req, res) => {
    try {
      const { industry } = req.params;
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${industry}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
      );
      const data = (await response.json()) as MarketDataResponse;

      const marketData: MarketAnalysis = {
        marketSize: data.MarketCapitalization || "Unknown",
        growthRate: calculateGrowthRate(data),
        competitors: await getCompetitors(industry),
        revenueProjections: generateProjections(data),
      };

      res.json(marketData);
    } catch (error) {
      console.error('Market data error:', error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.post("/api/reddit/analyze", async (req, res) => {
    try {
      const { idea, industry } = req.body as { idea: string; industry: string };

      const subreddits = ['startups', 'entrepreneur', industry.toLowerCase()];
      let allPosts: Submission[] = [];

      for (const subreddit of subreddits) {
        try {
          const posts = await reddit.getSubreddit(subreddit)
            .search({ query: idea, time: 'year', sort: 'relevance' });
          allPosts = [...allPosts, ...posts];
        } catch (error) {
          console.error(`Error fetching from r/${subreddit}:`, error);
        }
      }

      const analysis = await analyzePosts(allPosts);
      res.json(analysis);
    } catch (error) {
      console.error('Reddit analysis error:', error);
      res.status(500).json({ error: "Failed to analyze Reddit sentiment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateGrowthRate(data: MarketDataResponse): string {
  // TODO: Implement actual growth rate calculation
  return "12%"; 
}

async function getCompetitors(industry: string): Promise<CompetitorData[]> {
  // TODO: Implement actual competitor fetching
  return []; 
}

function generateProjections(data: MarketDataResponse): Array<{ year: number; revenue: number }> {
  // TODO: Implement actual projections
  return []; 
}

async function analyzePosts(posts: Submission[]): Promise<RedditAnalysis> {
  // TODO: Implement actual sentiment analysis
  return {
    overallSentiment: {
      positive: 60,
      neutral: 30,
      negative: 10,
    },
    topPosts: [],
    keywords: [],
  }; 
}