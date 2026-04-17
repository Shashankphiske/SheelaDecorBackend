-- DropForeignKey
ALTER TABLE "stitchings" DROP CONSTRAINT "stitchings_product_id_fkey";

-- AddForeignKey
ALTER TABLE "stitchings" ADD CONSTRAINT "stitchings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
