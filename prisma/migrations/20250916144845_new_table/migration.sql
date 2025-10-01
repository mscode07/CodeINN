-- CreateTable
CREATE TABLE "public"."UserPromptHistoryTable" (
    "id" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPromptHistoryTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserPromptHistoryTable" ADD CONSTRAINT "UserPromptHistoryTable_userID_fkey" FOREIGN KEY ("userID") REFERENCES "public"."UserTable"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
