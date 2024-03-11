/*
  Warnings:

  - You are about to alter the column `duration` on the `Plans` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `Plans` MODIFY `duration` INTEGER NOT NULL;
