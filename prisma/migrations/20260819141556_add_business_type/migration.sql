-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('RESTAURANT', 'HOTEL', 'EVENT_ORGANIZER', 'EVENT', 'PROMOTION', 'MARKETING', 'SHOPPING_MALL', 'THEATER', 'SHOWROOM', 'REAL_ESTATE', 'CONVENTION', 'RETAIL', 'EDUCATION', 'HEALTHCARE', 'OTHER');

-- AlterTable
ALTER TABLE "Business" ADD COLUMN "businessType" "BusinessType" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE INDEX "Business_businessType_idx" ON "Business"("businessType");