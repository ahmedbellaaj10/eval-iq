CREATE TABLE "evaluation_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer,
	"test_case_id" integer,
	"result" text NOT NULL,
	"score" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experiment_test_case_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer NOT NULL,
	"test_case_id" integer NOT NULL,
	"bleu_score" numeric,
	"rouge_score" numeric,
	"sbert_score" numeric,
	"qag_score" numeric,
	"g_eval_score" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_prompts" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"iq_aspect" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "experiment_test_cases" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "results" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "experiment_test_cases" CASCADE;--> statement-breakpoint
DROP TABLE "results" CASCADE;--> statement-breakpoint
ALTER TABLE "llms" RENAME COLUMN "api_url" TO "provider";--> statement-breakpoint
ALTER TABLE "test_cases" RENAME COLUMN "user_message" TO "prompt";--> statement-breakpoint
ALTER TABLE "experiments" ALTER COLUMN "llm_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "system_prompt_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "experiments" ADD COLUMN "aggregate_score" jsonb;--> statement-breakpoint
ALTER TABLE "test_cases" ADD COLUMN "system_prompt_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluation_results" ADD CONSTRAINT "evaluation_results_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_results" ADD CONSTRAINT "evaluation_results_test_case_id_test_cases_id_fk" FOREIGN KEY ("test_case_id") REFERENCES "public"."test_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_test_case_scores" ADD CONSTRAINT "experiment_test_case_scores_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_test_case_scores" ADD CONSTRAINT "experiment_test_case_scores_test_case_id_test_cases_id_fk" FOREIGN KEY ("test_case_id") REFERENCES "public"."test_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_system_prompt_id_system_prompts_id_fk" FOREIGN KEY ("system_prompt_id") REFERENCES "public"."system_prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_cases" ADD CONSTRAINT "test_cases_system_prompt_id_system_prompts_id_fk" FOREIGN KEY ("system_prompt_id") REFERENCES "public"."system_prompts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiments" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "experiments" DROP COLUMN "system_prompt";--> statement-breakpoint
ALTER TABLE "test_cases" DROP COLUMN "grader_type";