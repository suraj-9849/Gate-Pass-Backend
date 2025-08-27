-- AlterTable
ALTER TABLE "public"."gate_passes" ADD COLUMN     "used_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."scan_logs" (
    "id" TEXT NOT NULL,
    "gate_pass_id" TEXT NOT NULL,
    "security_id" TEXT NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scan_logs_gate_pass_id_idx" ON "public"."scan_logs"("gate_pass_id");

-- CreateIndex
CREATE INDEX "scan_logs_security_id_idx" ON "public"."scan_logs"("security_id");

-- CreateIndex
CREATE INDEX "scan_logs_scanned_at_idx" ON "public"."scan_logs"("scanned_at");

-- CreateIndex
CREATE INDEX "gate_passes_qr_code_idx" ON "public"."gate_passes"("qr_code");

-- AddForeignKey
ALTER TABLE "public"."scan_logs" ADD CONSTRAINT "scan_logs_gate_pass_id_fkey" FOREIGN KEY ("gate_pass_id") REFERENCES "public"."gate_passes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scan_logs" ADD CONSTRAINT "scan_logs_security_id_fkey" FOREIGN KEY ("security_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
