/*
  Warnings:

  - You are about to alter the column `price` on the `MenuItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `rating` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,1)`.

*/
-- AlterTable
ALTER TABLE `MenuItem` MODIFY `price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Restaurant` MODIFY `rating` DECIMAL(2, 1) NOT NULL DEFAULT 0.0;
