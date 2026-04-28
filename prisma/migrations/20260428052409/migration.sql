/*
  Warnings:

  - You are about to drop the column `project_product_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `area_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalogue_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_project_product_id_fkey";

-- DropIndex
DROP INDEX "orders_project_product_id_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "project_product_id",
ADD COLUMN     "area_id" UUID NOT NULL,
ADD COLUMN     "brand_id" UUID NOT NULL,
ADD COLUMN     "catalogue_id" UUID NOT NULL,
ADD COLUMN     "product_id" UUID NOT NULL,
ADD COLUMN     "project_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "catalogues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
