/*
  Warnings:

  - You are about to drop the `stichings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "stichings" DROP CONSTRAINT "stichings_product_id_fkey";

-- DropTable
DROP TABLE "stichings";

-- CreateTable
CREATE TABLE "stitchings" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "unit" "SellingUnit" NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "stitchings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stitchings" ADD CONSTRAINT "stitchings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
