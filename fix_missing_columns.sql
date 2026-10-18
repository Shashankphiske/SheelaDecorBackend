ALTER TABLE "authorizations" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "authorizations" SET "created_at" = datetime('now');

ALTER TABLE "deals_in" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "deals_in" SET "created_at" = datetime('now');

ALTER TABLE "artisan_types" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "artisan_types" SET "created_at" = datetime('now');

ALTER TABLE "project_products" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "project_products" SET "created_at" = datetime('now');

ALTER TABLE "project_labours" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "project_labours" SET "created_at" = datetime('now');

ALTER TABLE "orders" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "orders" SET "created_at" = datetime('now');

ALTER TABLE "measurements_data" ADD COLUMN "created_at" DATETIME DEFAULT '2026-01-01 00:00:00';
UPDATE "measurements_data" SET "created_at" = datetime('now');

CREATE INDEX IF NOT EXISTS "authorizations_id_created_at_idx" ON "authorizations"("id", "created_at");
CREATE INDEX IF NOT EXISTS "deals_in_id_created_at_idx" ON "deals_in"("id", "created_at");
CREATE INDEX IF NOT EXISTS "artisan_types_id_created_at_idx" ON "artisan_types"("id", "created_at");
CREATE INDEX IF NOT EXISTS "project_products_id_created_at_idx" ON "project_products"("id", "created_at");
CREATE INDEX IF NOT EXISTS "project_labours_id_created_at_idx" ON "project_labours"("id", "created_at");
CREATE INDEX IF NOT EXISTS "orders_id_created_at_idx" ON "orders"("id", "created_at");
CREATE INDEX IF NOT EXISTS "measurements_data_id_created_at_idx" ON "measurements_data"("id", "created_at");
