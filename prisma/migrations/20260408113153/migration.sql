-- AlterTable
ALTER TABLE "project_products" ADD COLUMN     "tailorId" UUID;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "tailors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
