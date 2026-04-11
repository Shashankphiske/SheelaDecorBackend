/*
  Warnings:

  - You are about to drop the column `projectId` on the `custom_poducts` table. All the data in the column will be lost.
  - You are about to drop the column `measurementUnit` on the `project_products` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `custom_poducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `project_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `project_products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "custom_poducts" DROP CONSTRAINT "custom_poducts_projectId_fkey";

-- AlterTable
ALTER TABLE "custom_poducts" DROP COLUMN "projectId",
ADD COLUMN     "project_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "project_products" DROP COLUMN "measurementUnit",
ADD COLUMN     "measurement_unit" "SellingUnit" NOT NULL DEFAULT 'METER',
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "remark" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "custom_poducts" ADD CONSTRAINT "custom_poducts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
