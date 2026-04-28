-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "tax_rate" DROP NOT NULL,
ALTER COLUMN "dimension_type" DROP NOT NULL;
