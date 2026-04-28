/*
  Warnings:

  - A unique constraint covering the columns `[name,email,phonenumber]` on the table `artisans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "artisans_name_email_phonenumber_key" ON "artisans"("name", "email", "phonenumber");
