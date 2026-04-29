-- DropIndex
DROP INDEX "payments_id_created_at_idx";

-- CreateIndex
CREATE INDEX "payments_created_at_id_idx" ON "payments"("created_at", "id");

-- CreateIndex
CREATE INDEX "payments_created_at_amount_idx" ON "payments"("created_at", "amount");
