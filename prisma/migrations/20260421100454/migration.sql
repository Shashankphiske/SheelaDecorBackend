-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_bank_id_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "bank_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
