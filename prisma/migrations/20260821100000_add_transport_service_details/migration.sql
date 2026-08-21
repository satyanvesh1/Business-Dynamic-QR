-- Add transport service details to Product

ALTER TABLE "Product"
ADD COLUMN "serviceType" TEXT,
ADD COLUMN "vehicleType" TEXT,
ADD COLUMN "startingLocation" TEXT,
ADD COLUMN "destination" TEXT,
ADD COLUMN "route" TEXT,
ADD COLUMN "availability" TEXT;