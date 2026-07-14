/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Ksb" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "type" "KsbType" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Ksb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "ksbId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "feedback" TEXT,
    "pointsAwarded" INTEGER NOT NULL DEFAULT 0,
    "rewarded" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "reviewedById" UUID NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ksb_code_key" ON "Ksb"("code");

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_ksbId_fkey" FOREIGN KEY ("ksbId") REFERENCES "Ksb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
