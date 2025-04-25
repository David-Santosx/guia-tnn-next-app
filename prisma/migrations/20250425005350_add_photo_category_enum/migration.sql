/*
  Warnings:

  - The `category` column on the `Photo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PhotoCategory" AS ENUM ('NATUREZA', 'LOCAIS', 'EVENTOS', 'GERAL');

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "category",
ADD COLUMN     "category" "PhotoCategory";
