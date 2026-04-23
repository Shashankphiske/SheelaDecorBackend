-- CreateTable
CREATE TABLE "dealers" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "deals_in" TEXT,
    "person_name" TEXT,
    "phonenumber" TEXT,
    "email" TEXT,
    "catalogue_link" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dealers_name_person_name_key" ON "dealers"("name", "person_name");
