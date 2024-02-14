-- CreateTable
CREATE TABLE "Poker" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokerOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pokerId" TEXT NOT NULL,

    CONSTRAINT "PokerOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pokerId" TEXT NOT NULL,
    "pokerOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_sessionId_pokerId_key" ON "Vote"("sessionId", "pokerId");

-- AddForeignKey
ALTER TABLE "PokerOption" ADD CONSTRAINT "PokerOption_pokerId_fkey" FOREIGN KEY ("pokerId") REFERENCES "Poker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pokerOptionId_fkey" FOREIGN KEY ("pokerOptionId") REFERENCES "PokerOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_pokerId_fkey" FOREIGN KEY ("pokerId") REFERENCES "Poker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
