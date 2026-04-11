/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `stitchings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "stitchings" DROP CONSTRAINT "stitchings_product_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "stitchings_product_id_key" ON "stitchings"("product_id");

-- AddForeignKey
ALTER TABLE "stitchings" ADD CONSTRAINT "stitchings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
