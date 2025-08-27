/*
  Warnings:

  - You are about to drop the `GatePass` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."user_roles" AS ENUM ('super_admin', 'teacher', 'student', 'security');

-- CreateEnum
CREATE TYPE "public"."pass_statuses" AS ENUM ('pending', 'approved', 'rejected', 'used', 'expired');

-- DropForeignKey
ALTER TABLE "public"."GatePass" DROP CONSTRAINT "GatePass_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GatePass" DROP CONSTRAINT "GatePass_teacherId_fkey";

-- DropTable
DROP TABLE "public"."GatePass";

-- DropTable
DROP TABLE "public"."User";

-- DropEnum
DROP TYPE "public"."PassStatus";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."user_roles" NOT NULL DEFAULT 'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gate_passes" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "teacher_id" TEXT,
    "reason" TEXT NOT NULL,
    "status" "public"."pass_statuses" NOT NULL DEFAULT 'pending',
    "remarks" TEXT,
    "request_date" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "qr_code" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gate_passes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "gate_passes_student_id_idx" ON "public"."gate_passes"("student_id");

-- CreateIndex
CREATE INDEX "gate_passes_teacher_id_idx" ON "public"."gate_passes"("teacher_id");

-- CreateIndex
CREATE INDEX "gate_passes_status_idx" ON "public"."gate_passes"("status");

-- CreateIndex
CREATE INDEX "gate_passes_valid_until_idx" ON "public"."gate_passes"("valid_until");

-- AddForeignKey
ALTER TABLE "public"."gate_passes" ADD CONSTRAINT "gate_passes_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gate_passes" ADD CONSTRAINT "gate_passes_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
