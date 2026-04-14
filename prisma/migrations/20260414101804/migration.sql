-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "phonenumber" SET DATA TYPE TEXT,
ALTER COLUMN "alternate_phonenumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "inquiries" ALTER COLUMN "phonenumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tailors" ALTER COLUMN "phonenumber" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phonenumber" SET DATA TYPE TEXT,
ALTER COLUMN "alternate_phonenumber" SET DATA TYPE TEXT;
