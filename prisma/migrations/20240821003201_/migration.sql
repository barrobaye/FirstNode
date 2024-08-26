/*
  Warnings:

  - Made the column `clientId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clientId" SET NOT NULL;
