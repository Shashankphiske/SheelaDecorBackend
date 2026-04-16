/*
  Warnings:

  - You are about to drop the `custom_poducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "custom_poducts" DROP CONSTRAINT "custom_poducts_project_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "remarks" DROP NOT NULL;

-- DropTable
DROP TABLE "custom_poducts";
