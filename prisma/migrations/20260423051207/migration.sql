/*
  Warnings:

  - Added the required column `launch_year` to the `catalogues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `catalogues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rack_no` to the `catalogues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `catalogues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "catalogues" ADD COLUMN     "launch_year" INTEGER NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "rack_no" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
