/*
  Warnings:

  - You are about to drop the `tailors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ArtisanType" AS ENUM ('TAILOR', 'SOFA_WORKER');

-- DropTable
DROP TABLE "tailors";

-- CreateTable
CREATE TABLE "artisans" (
    "id" UUID NOT NULL,
    "artisan_type" "ArtisanType" NOT NULL DEFAULT 'TAILOR',
    "name" TEXT NOT NULL,
    "phonenumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artisans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "artisans_id_created_at_idx" ON "artisans"("id", "created_at");
