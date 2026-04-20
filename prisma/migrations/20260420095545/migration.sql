/*
  Warnings:

  - The values [RUNNING_FEET] on the enum `SellingUnit` will be removed. If these variants are still used in the database, this will fail.
  - The values [PEICE] on the enum `productType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SellingUnit_new" AS ENUM ('METER', 'FEET', 'INCHES', 'CENTIMETER', 'PANHA', 'RFT', 'SQFT', 'SQM', 'SQY', 'ROLL', 'PIECE', 'PANEL');
ALTER TABLE "public"."project_products" ALTER COLUMN "measurement_unit" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "selling_unit" TYPE "SellingUnit_new" USING ("selling_unit"::text::"SellingUnit_new");
ALTER TABLE "stitchings" ALTER COLUMN "unit" TYPE "SellingUnit_new" USING ("unit"::text::"SellingUnit_new");
ALTER TABLE "project_products" ALTER COLUMN "measurement_unit" TYPE "SellingUnit_new" USING ("measurement_unit"::text::"SellingUnit_new");
ALTER TYPE "SellingUnit" RENAME TO "SellingUnit_old";
ALTER TYPE "SellingUnit_new" RENAME TO "SellingUnit";
DROP TYPE "public"."SellingUnit_old";
ALTER TABLE "project_products" ALTER COLUMN "measurement_unit" SET DEFAULT 'METER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "productType_new" AS ENUM ('FABRIC', 'AREA', 'RUNNING_LENGTH', 'PIECE', 'FIXED_LENGTH', 'FIXED_AREA', 'TAILORING', 'SOFA_TYPE');
ALTER TYPE "productType" RENAME TO "productType_old";
ALTER TYPE "productType_new" RENAME TO "productType";
DROP TYPE "public"."productType_old";
COMMIT;
