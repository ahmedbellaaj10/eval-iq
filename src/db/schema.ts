import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const llms = pgTable('llms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  api_url: text('api_url'),
  created_at: timestamp('created_at').defaultNow(),
});

export const testCases = pgTable('test_cases', {
  id: serial('id').primaryKey(),
  user_message: text('user_message').notNull(),
  expected_output: text('expected_output').notNull(),
  grader_type: text('grader_type'),
  created_at: timestamp('created_at').defaultNow(),
});

export const experiments = pgTable('experiments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  system_prompt: text('system_prompt').notNull(),
  llm_id: integer('llm_id').references(() => llms.id),
  created_at: timestamp('created_at').defaultNow(),
});

export const experimentTestCases = pgTable('experiment_test_cases', {
  id: serial('id').primaryKey(),
  experiment_id: integer('experiment_id').references(() => experiments.id),
  test_case_id: integer('test_case_id').references(() => testCases.id),
});

export const results = pgTable('results', {
  id: serial('id').primaryKey(),
  experiment_id: integer('experiment_id').references(() => experiments.id),
  test_case_id: integer('test_case_id').references(() => testCases.id),
  score: integer('score'),
  response: text('response'),
  created_at: timestamp('created_at').defaultNow(),
});
