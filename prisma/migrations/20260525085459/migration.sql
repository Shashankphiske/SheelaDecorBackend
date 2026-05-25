-- CreateTable
CREATE TABLE "measurements" (
    "id" UUID NOT NULL,
    "project_name" TEXT NOT NULL,
    "areaId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "length" DECIMAL(65,30),
    "width" DECIMAL(65,30),
    "height" DECIMAL(65,30),

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
