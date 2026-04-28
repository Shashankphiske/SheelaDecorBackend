-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "project_product_id" UUID NOT NULL,
    "orderedDate" TIMESTAMPTZ,
    "quantity" DECIMAL(65,30),
    "order_id" TEXT,
    "received_date" TIMESTAMPTZ,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_project_product_id_key" ON "orders"("project_product_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_project_product_id_fkey" FOREIGN KEY ("project_product_id") REFERENCES "project_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
