/*
  Warnings:

  - You are about to drop the column `deals_in` on the `dealers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dealers" DROP COLUMN "deals_in",
ADD COLUMN     "deals_in_id" UUID;

-- CreateTable
CREATE TABLE "DealsIn" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DealsIn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealsIn_name_key" ON "DealsIn"("name");

-- AddForeignKey
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_deals_in_id_fkey" FOREIGN KEY ("deals_in_id") REFERENCES "DealsIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;
