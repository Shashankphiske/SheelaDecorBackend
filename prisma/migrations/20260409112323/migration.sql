/*
  Warnings:

  - You are about to drop the column `interior_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `sales_associate_id` on the `projects` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SellingUnit" ADD VALUE 'PANHA';
ALTER TYPE "SellingUnit" ADD VALUE 'RUNNING_FEET';

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_interior_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_sales_associate_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "tailoringCharge" INTEGER;

-- AlterTable
ALTER TABLE "project_products" ADD COLUMN     "length" INTEGER,
ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "width" DROP DEFAULT,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "height" DROP DEFAULT;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "interior_id",
DROP COLUMN "sales_associate_id",
ADD COLUMN     "creatorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
