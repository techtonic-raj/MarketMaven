import OpenAI from "openai";
import type { StartupIdea } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface DetailedAnalysis {
  executiveSummary: {
    overview: string;
    keyFindings: string[];
    recommendations: string[];
    viabilityScore: number;
  };
  marketAnalysis: {
    marketSize: string;
    growthPotential: string;
    targetDemographics: {
      segments: string[];
      description: string;
    };
    industryTrends: string[];
  };
  competitorAnalysis: {
    directCompetitors: Array<{
      name: string;
      strengths: string[];
      weaknesses: string[];
    }>;
    marketGaps: string[];
    opportunities: string[];
  };
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  financialProjections: {
    revenueProjections: Array<{
      year: number;
      revenue: number;
      growth: number;
    }>;
    breakEvenAnalysis: {
      timeframe: string;
      keyFactors: string[];
    };
  };
}

export async function generateDetailedAnalysis(idea: StartupIdea): Promise<DetailedAnalysis> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "system",
          content: "You are an expert business analyst specializing in startup validation and market analysis. Analyze the provided startup idea and generate comprehensive insights.",
        },
        {
          role: "user",
          content: JSON.stringify({
            name: idea.name,
            description: idea.description,
            valueProposition: idea.valueProposition,
            targetMarket: idea.targetMarket,
            industry: idea.targetMarket.industry,
          }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content) as DetailedAnalysis;
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to generate detailed analysis");
  }
}

export async function analyzeSentimentWithAI(posts: any[]): Promise<{
  summary: string;
  sentiment: { positive: number; neutral: number; negative: number };
  keyThemes: { theme: string; frequency: number; sentiment: number }[];
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Analyze the sentiment and key themes from the provided social media posts. Provide a detailed summary and breakdown.",
        },
        {
          role: "user",
          content: JSON.stringify(posts.map(p => ({ title: p.title, text: p.selftext }))),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI sentiment analysis error:", error);
    throw new Error("Failed to analyze sentiment");
  }
}

export async function generateRecommendations(
  idea: StartupIdea,
  marketData: any,
  sentimentData: any
): Promise<{
  features: string[];
  improvements: string[];
  marketingStrategies: string[];
  timeline: { phase: string; duration: string; activities: string[] }[];
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Generate actionable recommendations and a strategic roadmap based on the market analysis and sentiment data.",
        },
        {
          role: "user",
          content: JSON.stringify({ idea, marketData, sentimentData }),
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI recommendations error:", error);
    throw new Error("Failed to generate recommendations");
  }
}