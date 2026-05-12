/*
  Warnings:

  - The values [bh] on the enum `DimensionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SOFA', 'CHAIR', 'OTTOMANS_PUFFY', 'CURTAIN', 'ROMAN_BLINDS', 'CORIAN', 'ORTHO_QUIRE_GAADI', 'BEDBACK', 'PILLOW_COVERS', 'CUSTOM_WALLPAPERS', 'WOODEN_FLOORING', 'PVC_FLOORING', 'CARPET', 'RUBBER_GYM_FLOORING', 'ROLLER_ZEBRA_VENETIAN_VERTICALBLINDS', 'BLINDS', 'BEDSHEET', 'PILLOW', 'MATTRESS_READY', 'MATTRESS_PROTECTOR', 'COMFORTERS', 'DINING', 'WALLPAPER_ROLL', 'RUGS');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CUSTOM', 'AREA', 'READY');

-- AlterEnum
BEGIN;
CREATE TYPE "DimensionType_new" AS ENUM ('lb', 'lh', 'lbh');
ALTER TABLE "public"."products" ALTER COLUMN "dimension_type" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "dimension_type" TYPE "DimensionType_new" USING ("dimension_type"::text::"DimensionType_new");
ALTER TYPE "DimensionType" RENAME TO "DimensionType_old";
ALTER TYPE "DimensionType_new" RENAME TO "DimensionType";
DROP TYPE "public"."DimensionType_old";
ALTER TABLE "products" ALTER COLUMN "dimension_type" SET DEFAULT 'lbh';
COMMIT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_category" "ProductCategory";

-- DropEnum
DROP TYPE "productType";
