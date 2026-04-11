/*
  Warnings:

  - You are about to drop the column `amount` on the `custom_poducts` table. All the data in the column will be lost.
  - You are about to drop the column `mrp` on the `products` table. All the data in the column will be lost.
  - Added the required column `price` to the `custom_poducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banks" ALTER COLUMN "pincode" SET DATA TYPE TEXT,
ALTER COLUMN "account_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "custom_poducts" DROP COLUMN "amount",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "project_id" UUID,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "mrp",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ALTER COLUMN "tax_rate" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "project_products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "width" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "height" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "length" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "total_amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "total_tax" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "paid" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "stichings" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "unit" "SellingUnit" NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "stichings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stichings" ADD CONSTRAINT "stichings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
