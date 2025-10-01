/*
  Warnings:

  - Added the required column `r2Key` to the `UserPromptHistoryTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserPromptHistoryTable" ADD COLUMN     "r2Key" TEXT NOT NULL;
