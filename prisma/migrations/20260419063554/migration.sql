-- CreateTable
CREATE TABLE "authorizations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "access" TEXT NOT NULL,

    CONSTRAINT "authorizations_pkey" PRIMARY KEY ("id")
);
