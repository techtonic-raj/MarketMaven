import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const startupIdeas = pgTable("startup_ideas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  valueProposition: text("value_proposition").notNull(),
  targetMarket: json("target_market").$type<{ industry: string }>().notNull(),
  competitors: json("competitors").$type<Array<string>>().notNull().default([]),
  keywords: text("keywords").array().notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertStartupIdeaSchema = createInsertSchema(startupIdeas)
  .omit({ id: true, status: true, submittedAt: true, competitors: true })
  .extend({
    targetMarket: z.object({
      industry: z.string().min(1, "Industry is required"),
    }),
  });

export type InsertStartupIdea = z.infer<typeof insertStartupIdeaSchema>;
export type StartupIdea = typeof startupIdeas.$inferSelect;
export type TargetMarket = { industry: string; }; // Updated type
export type Competitor = Array<string>; // Updated type