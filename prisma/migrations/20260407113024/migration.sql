/*
  Warnings:

  - You are about to drop the `companies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project_products" DROP CONSTRAINT "project_products_company_id_fkey";

-- DropTable
DROP TABLE "companies";

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
