admin@gatepass.com/*
  Warnings:

  - Made the column `remarks` on table `gate_passes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."gate_passes" ALTER COLUMN "remarks" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "roll_no" VARCHAR(20);

-- CreateIndex
CREATE INDEX "users_roll_no_idx" ON "public"."users"("roll_no");
