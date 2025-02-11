import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const startupIdeas = pgTable("startup_ideas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  valueProposition: text("value_proposition").notNull(),
  targetMarket: json("target_market").notNull(),
  competitors: json("competitors").notNull(),
  keywords: text("keywords").array().notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertStartupIdeaSchema = createInsertSchema(startupIdeas)
  .omit({ id: true, status: true, submittedAt: true });

export const targetMarketSchema = z.object({
  demographics: z.string(),
  marketSize: z.string(),
  industry: z.string(),
});

export const competitorSchema = z.object({
  name: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export type InsertStartupIdea = z.infer<typeof insertStartupIdeaSchema>;
export type StartupIdea = typeof startupIdeas.$inferSelect;
export type TargetMarket = z.infer<typeof targetMarketSchema>;
export type Competitor = z.infer<typeof competitorSchema>;
