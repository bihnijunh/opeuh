-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "recipientId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "btc" SET DEFAULT 0,
ALTER COLUMN "eth" SET DEFAULT 0,
ALTER COLUMN "usdt" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "ReceivedTransaction" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "cryptoType" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "senderUsername" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionHash" TEXT NOT NULL,

    CONSTRAINT "ReceivedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedTransaction_transactionHash_key" ON "ReceivedTransaction"("transactionHash");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_recipientId_idx" ON "Transaction"("recipientId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
