import { pgTable, serial, text, timestamp, integer, jsonb, numeric } from "drizzle-orm/pg-core";

// LLMs table
export const llms = pgTable("llms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});


// Test cases table
export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  expected_output: text("expected_output").notNull(),
  system_prompt_id: integer("system_prompt_id")
    .references(() => systemPrompts.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
});


// System prompts table
export const systemPrompts = pgTable("system_prompts", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  iq_aspect: text("iq_aspect").notNull(), // Single value for IQ aspect
  created_at: timestamp("created_at").defaultNow(),
});

// Experiments table
export const experiments = pgTable("experiments", {
  id: serial("id").primaryKey(),
  llm_id: integer("llm_id").references(() => llms.id).notNull(),
  system_prompt_id: integer("system_prompt_id")
    .references(() => systemPrompts.id)
    .notNull(),
  aggregate_score: jsonb("aggregate_score"),
  created_at: timestamp("created_at").defaultNow(),
});

// Evaluation results table
export const evaluationResults = pgTable("evaluation_results", {
  id: serial("id").primaryKey(),
  experiment_id: integer("experiment_id").references(() => experiments.id),
  test_case_id: integer("test_case_id").references(() => testCases.id),
  result: text("result").notNull(),
  score: integer("score"),
  created_at: timestamp("created_at").defaultNow(),
});

// Experiment scores table
export const experimentTestCaseScores = pgTable("experiment_test_case_scores", {
  id: serial("id").primaryKey(),
  experiment_id: integer("experiment_id").references(() => experiments.id).notNull(),
  test_case_id: integer("test_case_id").references(() => testCases.id).notNull(),
  bleu_score: numeric("bleu_score"),  // Use numeric for floating-point fields
  rouge_score: numeric("rouge_score"),
  sbert_score: numeric("sbert_score"),
  qag_score: numeric("qag_score"),
  g_eval_score: numeric("g_eval_score"),
  created_at: timestamp("created_at").defaultNow(),
});
