-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "from_wallet" TEXT,
    "to_wallet" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bank_reference" TEXT,
    "recipient_org" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_tx_hash_key" ON "Donation"("tx_hash");

-- CreateIndex
CREATE INDEX "Donation_datetime_idx" ON "Donation"("datetime" DESC);

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
