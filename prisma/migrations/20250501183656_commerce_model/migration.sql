-- CreateTable
CREATE TABLE "Commerce" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "rate" INTEGER,
    "owner" TEXT NOT NULL,
    "hours" TEXT,
    "imageUrl" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedById" TEXT,

    CONSTRAINT "Commerce_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Commerce" ADD CONSTRAINT "Commerce_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
