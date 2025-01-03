ALTER TABLE "system_prompts" ADD COLUMN "prompt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "system_prompts" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "system_prompts" DROP COLUMN "description";