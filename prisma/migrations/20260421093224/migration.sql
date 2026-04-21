/*
  Warnings:

  - Added the required column `cost` to the `projectLabours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `projectLabours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `projectLabours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `projectLabours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "projectLabours" ADD COLUMN     "cost" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "projectId" UUID NOT NULL,
ADD COLUMN     "unit" "SellingUnit" NOT NULL;

-- AddForeignKey
ALTER TABLE "projectLabours" ADD CONSTRAINT "projectLabours_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
