-- CreateTable
CREATE TABLE "inquiries" (
    "id" UUID NOT NULL,
    "project_name" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phonenumber" INTEGER NOT NULL,
    "comments" TEXT,
    "inquiry_date" TIMESTAMPTZ NOT NULL,
    "follow_up_date" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);
