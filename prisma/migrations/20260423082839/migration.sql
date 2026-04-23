/*
  Warnings:

  - You are about to drop the column `cost` on the `projectLabours` table. All the data in the column will be lost.
  - You are about to drop the column `stitchingId` on the `projectLabours` table. All the data in the column will be lost.
  - You are about to drop the `stitchings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `artisans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `projectLabours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projectLabours" DROP CONSTRAINT "projectLabours_stitchingId_fkey";

-- AlterTable
ALTER TABLE "artisans" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "projectLabours" DROP COLUMN "cost",
DROP COLUMN "stitchingId",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "stitchings";
