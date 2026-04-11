/*
  Warnings:

  - You are about to drop the `projectBankDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_areas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bankId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projectBankDetails" DROP CONSTRAINT "projectBankDetails_bankId_fkey";

-- DropForeignKey
ALTER TABLE "projectBankDetails" DROP CONSTRAINT "projectBankDetails_projectId_fkey";

-- DropForeignKey
ALTER TABLE "project_areas" DROP CONSTRAINT "project_areas_areaId_fkey";

-- DropForeignKey
ALTER TABLE "project_areas" DROP CONSTRAINT "project_areas_projectId_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "bankId" UUID NOT NULL;

-- DropTable
DROP TABLE "projectBankDetails";

-- DropTable
DROP TABLE "project_areas";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
