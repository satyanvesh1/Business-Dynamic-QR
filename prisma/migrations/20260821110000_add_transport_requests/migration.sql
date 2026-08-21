-- CreateEnum
CREATE TYPE "TransportRequestStatus" AS ENUM (
  'REQUESTED',
  'CONTACTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED'
);

-- CreateTable
CREATE TABLE "TransportRequest" (
  "id" TEXT NOT NULL,
  "businessId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "pickupLocation" TEXT,
  "destination" TEXT,
  "travelDate" TEXT,
  "travelTime" TEXT,
  "passengerCount" INTEGER,
  "notes" TEXT,
  "status" "TransportRequestStatus" NOT NULL DEFAULT 'REQUESTED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TransportRequest_pkey"
    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransportRequest_businessId_idx"
ON "TransportRequest"("businessId");

-- CreateIndex
CREATE INDEX "TransportRequest_productId_idx"
ON "TransportRequest"("productId");

-- CreateIndex
CREATE INDEX "TransportRequest_status_idx"
ON "TransportRequest"("status");

-- CreateIndex
CREATE INDEX "TransportRequest_createdAt_idx"
ON "TransportRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "TransportRequest"
ADD CONSTRAINT "TransportRequest_businessId_fkey"
FOREIGN KEY ("businessId")
REFERENCES "Business"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportRequest"
ADD CONSTRAINT "TransportRequest_productId_fkey"
FOREIGN KEY ("productId")
REFERENCES "Product"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;