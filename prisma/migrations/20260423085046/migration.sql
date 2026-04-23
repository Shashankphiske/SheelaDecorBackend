/*
  Warnings:

  - You are about to drop the column `artisan_type` on the `artisans` table. All the data in the column will be lost.
  - Added the required column `artisan_type_id` to the `artisans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "artisans" DROP COLUMN "artisan_type",
ADD COLUMN     "artisan_type_id" UUID NOT NULL;

-- DropEnum
DROP TYPE "ArtisanType";

-- CreateTable
CREATE TABLE "artisan_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "artisan_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artisan_types_name_key" ON "artisan_types"("name");

-- AddForeignKey
ALTER TABLE "artisans" ADD CONSTRAINT "artisans_artisan_type_id_fkey" FOREIGN KEY ("artisan_type_id") REFERENCES "artisan_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
