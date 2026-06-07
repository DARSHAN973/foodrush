-- AlterTable
ALTER TABLE `MenuItem` ADD COLUMN `isAvailable` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
