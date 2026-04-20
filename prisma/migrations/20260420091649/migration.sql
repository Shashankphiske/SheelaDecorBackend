/*
  Warnings:

  - A unique constraint covering the columns `[user_id,access]` on the table `authorizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DimensionType" AS ENUM ('lb', 'lh', 'bh', 'lbh');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "dimension_type" "DimensionType" NOT NULL DEFAULT 'lbh';

-- CreateIndex
CREATE UNIQUE INDEX "authorizations_user_id_access_key" ON "authorizations"("user_id", "access");
