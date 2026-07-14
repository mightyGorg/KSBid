-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "KsbType" AS ENUM ('KNOWLEDGE', 'SKILL', 'BEHAVIOR');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('PHYSICAL', 'DIGITAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "lifetimePoints" INTEGER NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
