/*
  Warnings:

  - You are about to drop the column `accountType` on the `banks` table. All the data in the column will be lost.
  - You are about to drop the column `bankId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `projects` table. All the data in the column will be lost.
  - Added the required column `account_type` to the `banks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BankTypes" AS ENUM ('SAVINGS', 'CURRENT', 'RECURRING', 'SALARY');

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_bankId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_creatorId_fkey";

-- AlterTable
ALTER TABLE "banks" DROP COLUMN "accountType",
ADD COLUMN     "account_type" "BankTypes" NOT NULL;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "bankId",
DROP COLUMN "creatorId",
ADD COLUMN     "bank_id" UUID NOT NULL,
ADD COLUMN     "creator_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
