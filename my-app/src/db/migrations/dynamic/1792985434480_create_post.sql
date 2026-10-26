-- Create dynamic collection: dc_post
CREATE TABLE IF NOT EXISTS "dc_post" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "slug" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now(),
  "created_by" text,
  "status" varchar(20) DEFAULT 'draft' NOT NULL,
  "first_published_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dc_post_created_at" ON "dc_post"("created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dc_post_created_by" ON "dc_post"("created_by");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_dc_post_slug" ON "dc_post"("slug");
--> statement-breakpoint
INSERT INTO "dynamic_collections" ("id", "slug", "labels", "table_name", "fields", "source", "schema_hash", "status", "localized", "versions", "revalidate", "webhooks", "migration_status", "admin", "created_at", "updated_at", "description") VALUES ('7d45d644-e454-f553-aece-48a0cf644cb2', 'post', '{"singular":"Post","plural":"Posts"}'::jsonb, 'dc_post', '[]'::jsonb, 'ui', 'b46d84d7e70cacb602e5e6c4a2759d5a024a6c68407b79bea77b601452a09e0a', true, false, NULL, NULL, NULL, 'applied', '{"icon":"Music"}'::jsonb, now(), now(), '') ON CONFLICT ("slug") DO UPDATE SET "labels" = EXCLUDED."labels", "fields" = EXCLUDED."fields", "schema_hash" = EXCLUDED."schema_hash", "status" = EXCLUDED."status", "localized" = EXCLUDED."localized", "versions" = EXCLUDED."versions", "revalidate" = EXCLUDED."revalidate", "webhooks" = EXCLUDED."webhooks", "admin" = EXCLUDED."admin", "updated_at" = EXCLUDED."updated_at", "description" = EXCLUDED."description"