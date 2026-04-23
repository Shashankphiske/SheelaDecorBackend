/*
  Warnings:

  - Made the column `person_name` on table `dealers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dealers" ALTER COLUMN "person_name" SET NOT NULL;
