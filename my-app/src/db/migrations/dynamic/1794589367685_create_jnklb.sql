-- Create dynamic collection: dc_jnklb
CREATE TABLE IF NOT EXISTS "dc_jnklb" (
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
CREATE INDEX IF NOT EXISTS "idx_dc_jnklb_created_at" ON "dc_jnklb"("created_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_dc_jnklb_created_by" ON "dc_jnklb"("created_by");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_dc_jnklb_slug" ON "dc_jnklb"("slug");
--> statement-breakpoint
INSERT INTO "dynamic_collections" ("id", "slug", "labels", "table_name", "fields", "source", "schema_hash", "status", "localized", "versions", "revalidate", "webhooks", "migration_status", "admin", "created_at", "updated_at", "description") VALUES ('6effd9d5-8685-e9f2-05be-36e7cecb7cab', 'jnklb', '{"singular":"jnklb","plural":"jnklbs"}'::jsonb, 'dc_jnklb', '[]'::jsonb, 'ui', 'b46d84d7e70cacb602e5e6c4a2759d5a024a6c68407b79bea77b601452a09e0a', true, false, NULL, NULL, NULL, 'applied', '{"icon":"FileText"}'::jsonb, now(), now(), '') ON CONFLICT ("slug") DO UPDATE SET "labels" = EXCLUDED."labels", "fields" = EXCLUDED."fields", "schema_hash" = EXCLUDED."schema_hash", "status" = EXCLUDED."status", "localized" = EXCLUDED."localized", "versions" = EXCLUDED."versions", "revalidate" = EXCLUDED."revalidate", "webhooks" = EXCLUDED."webhooks", "admin" = EXCLUDED."admin", "updated_at" = EXCLUDED."updated_at", "description" = EXCLUDED."description"