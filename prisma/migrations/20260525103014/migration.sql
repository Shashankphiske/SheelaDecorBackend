/*
  Warnings:

  - You are about to drop the `_AreasDataToProductData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AreasDataTomeasurements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `areas_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AreasDataToProductData" DROP CONSTRAINT "_AreasDataToProductData_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreasDataToProductData" DROP CONSTRAINT "_AreasDataToProductData_B_fkey";

-- DropForeignKey
ALTER TABLE "_AreasDataTomeasurements" DROP CONSTRAINT "_AreasDataTomeasurements_A_fkey";

-- DropForeignKey
ALTER TABLE "_AreasDataTomeasurements" DROP CONSTRAINT "_AreasDataTomeasurements_B_fkey";

-- DropForeignKey
ALTER TABLE "product_data" DROP CONSTRAINT "product_data_product_id_fkey";

-- DropTable
DROP TABLE "_AreasDataToProductData";

-- DropTable
DROP TABLE "_AreasDataTomeasurements";

-- DropTable
DROP TABLE "areas_data";

-- DropTable
DROP TABLE "product_data";

-- CreateTable
CREATE TABLE "measurements_data" (
    "id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "length" DECIMAL(65,30),
    "width" DECIMAL(65,30),
    "height" DECIMAL(65,30),
    "measurement_id" UUID NOT NULL,

    CONSTRAINT "measurements_data_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "measurements_data" ADD CONSTRAINT "measurements_data_measurement_id_fkey" FOREIGN KEY ("measurement_id") REFERENCES "measurements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements_data" ADD CONSTRAINT "measurements_data_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements_data" ADD CONSTRAINT "measurements_data_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
