-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'INTERIOR', 'SALES_ASSOCIATE');

-- CreateEnum
CREATE TYPE "SellingUnit" AS ENUM ('METER', 'FEET', 'INCHES', 'CENTIMETER');

-- CreateEnum
CREATE TYPE "productType" AS ENUM ('FABRIC', 'AREA', 'RUNNING_LENGTH', 'PEICE', 'FIXED_LENGTH', 'FIXED_AREA', 'TAILORING');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'INPROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MODERATE', 'LOW');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phonenumber" INTEGER,
    "address" TEXT,
    "alternate_phonenumber" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'INTERIOR',
    "is_used" BOOLEAN NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenumber" INTEGER NOT NULL,
    "alternate_phonenumber" INTEGER,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogues" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_groups" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "product_group_id" UUID,
    "selling_unit" "SellingUnit",
    "product_type" TEXT,
    "mrp" INTEGER NOT NULL,
    "tax_rate" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tailors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phonenumber" INTEGER,
    "email" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tailors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banks" (
    "id" UUID NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_name" TEXT,
    "branch" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "account_number" INTEGER NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "customer_id" UUID,
    "status" "Status" NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "total_tax" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "discount_type" TEXT NOT NULL,
    "created_by" TEXT,
    "project_date" TIMESTAMPTZ NOT NULL,
    "additional_requests" TEXT,
    "interior_id" UUID,
    "sales_associate_id" UUID,
    "address" TEXT,
    "defaulter" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_products" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "product_group_id" UUID,
    "area_id" UUID,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "company_id" UUID,
    "catalogue_id" UUID,
    "design_no" INTEGER NOT NULL,
    "references" TEXT,
    "measurementUnit" "SellingUnit" NOT NULL DEFAULT 'METER',
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_areas" (
    "id" UUID NOT NULL,
    "areaId" UUID NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "project_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectBankDetails" (
    "id" UUID NOT NULL,
    "bankId" UUID NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "projectBankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "task_date" TIMESTAMPTZ NOT NULL,
    "project_id" UUID NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phonenumber" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "customer_id" UUID,
    "amount" INTEGER NOT NULL,
    "payment_mode" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_created_at_idx" ON "users"("id", "created_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "customers_id_created_at_idx" ON "customers"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE INDEX "brands_id_created_at_idx" ON "brands"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "catalogues_name_key" ON "catalogues"("name");

-- CreateIndex
CREATE INDEX "catalogues_id_created_at_idx" ON "catalogues"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_groups_name_key" ON "product_groups"("name");

-- CreateIndex
CREATE INDEX "product_groups_id_created_at_idx" ON "product_groups"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_id_created_at_idx" ON "products"("id", "created_at");

-- CreateIndex
CREATE INDEX "tailors_id_created_at_idx" ON "tailors"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");

-- CreateIndex
CREATE INDEX "areas_id_created_at_idx" ON "areas"("id", "created_at");

-- CreateIndex
CREATE INDEX "banks_id_created_at_idx" ON "banks"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_id_created_at_idx" ON "companies"("id", "created_at");

-- CreateIndex
CREATE INDEX "projects_id_created_at_idx" ON "projects"("id", "created_at");

-- CreateIndex
CREATE INDEX "tasks_id_created_at_idx" ON "tasks"("id", "created_at");

-- CreateIndex
CREATE INDEX "stores_id_created_at_idx" ON "stores"("id", "created_at");

-- CreateIndex
CREATE INDEX "payments_id_created_at_idx" ON "payments"("id", "created_at");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_interior_id_fkey" FOREIGN KEY ("interior_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_sales_associate_id_fkey" FOREIGN KEY ("sales_associate_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "catalogues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_product_group_id_fkey" FOREIGN KEY ("product_group_id") REFERENCES "product_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_areas" ADD CONSTRAINT "project_areas_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_areas" ADD CONSTRAINT "project_areas_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectBankDetails" ADD CONSTRAINT "projectBankDetails_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectBankDetails" ADD CONSTRAINT "projectBankDetails_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
