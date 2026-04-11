/*
  Warnings:

  - You are about to drop the column `defaulter` on the `projects` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE 'DEFAULTER';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "defaulter";
