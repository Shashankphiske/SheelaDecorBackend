-- AlterTable
ALTER TABLE "project_products" ALTER COLUMN "order_id" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
