/*
  Warnings:

  - You are about to drop the column `product_id` on the `stitchings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "stitchings" DROP CONSTRAINT "stitchings_product_id_fkey";

-- DropIndex
DROP INDEX "stitchings_product_id_key";

-- AlterTable
ALTER TABLE "catalogues" ADD COLUMN     "brand_id" UUID;

-- AlterTable
ALTER TABLE "stitchings" DROP COLUMN "product_id";

-- AddForeignKey
ALTER TABLE "catalogues" ADD CONSTRAINT "catalogues_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
