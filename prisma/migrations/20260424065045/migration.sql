-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'INTERIOR', 'SALES_ASSOCIATE');

-- CreateEnum
CREATE TYPE "SellingUnit" AS ENUM ('METER', 'FEET', 'INCHES', 'CENTIMETER', 'PANHA', 'RFT', 'SQFT', 'SQM', 'SQY', 'ROLL', 'PIECE', 'PANEL');

-- CreateEnum
CREATE TYPE "productType" AS ENUM ('FABRIC', 'AREA', 'RUNNING_LENGTH', 'PIECE', 'FIXED_LENGTH', 'FIXED_AREA', 'TAILORING', 'SOFA_TYPE', 'AP_CURTAIN', 'ROMAN_CURTAIN');

-- CreateEnum
CREATE TYPE "DimensionType" AS ENUM ('lb', 'lh', 'bh', 'lbh');

-- CreateEnum
CREATE TYPE "BankTypes" AS ENUM ('SAVINGS', 'CURRENT', 'RECURRING', 'SALARY');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('TODO', 'INPROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'ACTIVE', 'GOODS_PENDING', 'GOODS_COMPLETE', 'TAILOR_PENDING', 'TAILOR_COMPLETE', 'COMPLETED', 'DEFAULTER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('PENDING', 'ORDERED', 'RECEIVED', 'INSTOCK');

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
    "phonenumber" TEXT,
    "address" TEXT,
    "alternate_phonenumber" TEXT,
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
    "phonenumber" TEXT NOT NULL,
    "alternate_phonenumber" TEXT,
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
    "brand_id" UUID,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "launch_year" TEXT NOT NULL,
    "rack_no" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catalogues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deals_in" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "deals_in_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deals_in_id" UUID NOT NULL,
    "person_name" TEXT NOT NULL,
    "phonenumber" TEXT,
    "email" TEXT,
    "catalogue_link" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "selling_unit" "SellingUnit",
    "product_type" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "tax_rate" DECIMAL(65,30) NOT NULL,
    "dimension_type" "DimensionType" NOT NULL DEFAULT 'lbh',
    "size" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artisan_types" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "artisan_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artisans" (
    "id" UUID NOT NULL,
    "artisan_type_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phonenumber" TEXT,
    "email" TEXT,
    "address" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artisans_pkey" PRIMARY KEY ("id")
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
    "pincode" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "account_type" "BankTypes" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "customer_id" UUID,
    "creator_id" UUID NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "total_amount" DECIMAL(65,30),
    "total_tax" DECIMAL(65,30),
    "paid" DECIMAL(65,30),
    "discount" DECIMAL(65,30),
    "discount_type" TEXT,
    "project_date" TIMESTAMPTZ NOT NULL,
    "additional_requests" TEXT,
    "address" TEXT,
    "bank_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_products" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "area_id" UUID,
    "price" DECIMAL(65,30),
    "quantity" INTEGER,
    "company_id" UUID,
    "catalogue_id" UUID,
    "design_no" INTEGER,
    "references" TEXT,
    "measurement_unit" "SellingUnit" DEFAULT 'METER',
    "width" DECIMAL(65,30),
    "height" DECIMAL(65,30),
    "length" DECIMAL(65,30),
    "status" "ProductStatus" NOT NULL DEFAULT 'PENDING',
    "remark" TEXT,
    "order_id" TEXT,

    CONSTRAINT "project_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_labours" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "artisan_id" UUID,
    "price" DECIMAL(65,30) NOT NULL,
    "unit" "SellingUnit" NOT NULL,
    "key" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "project_labours_pkey" PRIMARY KEY ("id")
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
    "project_id" UUID,
    "amount" DECIMAL(65,30) NOT NULL,
    "payment_mode" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "project_name" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "comments" TEXT,
    "inquiry_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "follow_up_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authorizations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "authorizations_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "deals_in_name_key" ON "deals_in"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dealers_name_person_name_key" ON "dealers"("name", "person_name");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_id_created_at_idx" ON "products"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "artisan_types_name_key" ON "artisan_types"("name");

-- CreateIndex
CREATE INDEX "artisans_id_created_at_idx" ON "artisans"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");

-- CreateIndex
CREATE INDEX "areas_id_created_at_idx" ON "areas"("id", "created_at");

-- CreateIndex
CREATE INDEX "banks_id_created_at_idx" ON "banks"("id", "created_at");

-- CreateIndex
CREATE INDEX "projects_id_created_at_idx" ON "projects"("id", "created_at");

-- CreateIndex
CREATE INDEX "tasks_id_created_at_idx" ON "tasks"("id", "created_at");

-- CreateIndex
CREATE INDEX "stores_id_created_at_idx" ON "stores"("id", "created_at");

-- CreateIndex
CREATE INDEX "payments_id_created_at_idx" ON "payments"("id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "authorizations_user_id_access_key" ON "authorizations"("user_id", "access");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogues" ADD CONSTRAINT "catalogues_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dealers" ADD CONSTRAINT "dealers_deals_in_id_fkey" FOREIGN KEY ("deals_in_id") REFERENCES "deals_in"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artisans" ADD CONSTRAINT "artisans_artisan_type_id_fkey" FOREIGN KEY ("artisan_type_id") REFERENCES "artisan_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "banks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_catalogue_id_fkey" FOREIGN KEY ("catalogue_id") REFERENCES "catalogues"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_products" ADD CONSTRAINT "project_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_labours" ADD CONSTRAINT "project_labours_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_labours" ADD CONSTRAINT "project_labours_artisan_id_fkey" FOREIGN KEY ("artisan_id") REFERENCES "artisans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_labours" ADD CONSTRAINT "project_labours_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
