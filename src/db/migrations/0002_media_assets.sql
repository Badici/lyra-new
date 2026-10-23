CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"content_type" text NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
