-- CreateTable
CREATE TABLE "projectLabours" (
    "id" UUID NOT NULL,
    "stitchingId" UUID,
    "artisanId" UUID,
    "quantity" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "projectLabours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projectLabours" ADD CONSTRAINT "projectLabours_stitchingId_fkey" FOREIGN KEY ("stitchingId") REFERENCES "stitchings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projectLabours" ADD CONSTRAINT "projectLabours_artisanId_fkey" FOREIGN KEY ("artisanId") REFERENCES "artisans"("id") ON DELETE SET NULL ON UPDATE CASCADE;
