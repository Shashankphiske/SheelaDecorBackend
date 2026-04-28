-- CreateEnum
CREATE TYPE "LabourStatus" AS ENUM ('PENDING', 'COMPLETED', 'RECEIVED');

-- AlterTable
ALTER TABLE "project_labours" ADD COLUMN     "status" "LabourStatus" NOT NULL DEFAULT 'PENDING';
