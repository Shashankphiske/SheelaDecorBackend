/*
  Warnings:

  - Made the column `dimension_type` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "dimension_type" SET NOT NULL;
