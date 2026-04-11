/*
  Warnings:

  - You are about to drop the column `product_group_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_group_id` on the `project_products` table. All the data in the column will be lost.
  - You are about to drop the column `tailorId` on the `project_products` table. All the data in the column will be lost.
  - You are about to drop the `product_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_product_group_id_fkey";

-- DropForeignKey
ALTER TABLE "project_products" DROP CONSTRAINT "project_products_product_group_id_fkey";

-- DropForeignKey
ALTER TABLE "project_products" DROP CONSTRAINT "project_products_tailorId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_group_id";

-- AlterTable
ALTER TABLE "project_products" DROP COLUMN "product_group_id",
DROP COLUMN "tailorId";

-- DropTable
DROP TABLE "product_groups";
