-- CreateTable
CREATE TABLE "custom_poducts" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "projectId" UUID NOT NULL,

    CONSTRAINT "custom_poducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "custom_poducts" ADD CONSTRAINT "custom_poducts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
