/*
  Warnings:

  - The values [BEHAVIOR] on the enum `KsbType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KsbType_new" AS ENUM ('KNOWLEDGE', 'SKILL', 'BEHAVIOUR');
ALTER TABLE "Ksb" ALTER COLUMN "type" TYPE "KsbType_new" USING ("type"::text::"KsbType_new");
ALTER TYPE "KsbType" RENAME TO "KsbType_old";
ALTER TYPE "KsbType_new" RENAME TO "KsbType";
DROP TYPE "public"."KsbType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Evidence" ALTER COLUMN "reviewedById" DROP NOT NULL;
