/*
  Warnings:

  - You are about to drop the column `areaId` on the `measurements` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `measurements` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `measurements` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `measurements` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `measurements` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "measurements" DROP CONSTRAINT "measurements_areaId_fkey";

-- DropForeignKey
ALTER TABLE "measurements" DROP CONSTRAINT "measurements_productId_fkey";

-- AlterTable
ALTER TABLE "measurements" DROP COLUMN "areaId",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "productId",
DROP COLUMN "width";

-- CreateTable
CREATE TABLE "product_data" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "length" DECIMAL(65,30),
    "width" DECIMAL(65,30),
    "height" DECIMAL(65,30),

    CONSTRAINT "product_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas_data" (
    "id" UUID NOT NULL,
    "area_id" UUID NOT NULL,

    CONSTRAINT "areas_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreasDataToProductData" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AreasDataToProductData_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AreasDataTomeasurements" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AreasDataTomeasurements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AreasDataToProductData_B_index" ON "_AreasDataToProductData"("B");

-- CreateIndex
CREATE INDEX "_AreasDataTomeasurements_B_index" ON "_AreasDataTomeasurements"("B");

-- AddForeignKey
ALTER TABLE "product_data" ADD CONSTRAINT "product_data_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasDataToProductData" ADD CONSTRAINT "_AreasDataToProductData_A_fkey" FOREIGN KEY ("A") REFERENCES "areas_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasDataToProductData" ADD CONSTRAINT "_AreasDataToProductData_B_fkey" FOREIGN KEY ("B") REFERENCES "product_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasDataTomeasurements" ADD CONSTRAINT "_AreasDataTomeasurements_A_fkey" FOREIGN KEY ("A") REFERENCES "areas_data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreasDataTomeasurements" ADD CONSTRAINT "_AreasDataTomeasurements_B_fkey" FOREIGN KEY ("B") REFERENCES "measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
