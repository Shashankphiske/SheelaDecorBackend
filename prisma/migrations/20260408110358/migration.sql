/*
  Warnings:

  - Changed the type of `status` on the `projects` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ACTIVE', 'GOODS_PENDING', 'GOODS_COMPLETE', 'TAILOR_PENDING', 'TAILOR_COMPLETE', 'COMPLETED');

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "status",
ADD COLUMN     "status" "ProjectStatus" NOT NULL,
ALTER COLUMN "defaulter" SET DEFAULT false;
