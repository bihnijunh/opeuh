/*
  Warnings:

  - You are about to drop the column `cryptocurrency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `balanceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - The required column `transactionId` was added to the `Transaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `walletAddress` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `btc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usdt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Balance" DROP CONSTRAINT "Balance_userId_fkey";

-- DropIndex
DROP INDEX "User_balanceId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "cryptocurrency",
DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "btc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "eth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "transactionId" TEXT NOT NULL,
ADD COLUMN     "usdt" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balanceId",
ADD COLUMN     "btc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "eth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usdt" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Balance";

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionId_key" ON "Transaction"("transactionId");
