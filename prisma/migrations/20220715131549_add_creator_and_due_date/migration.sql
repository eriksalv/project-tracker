-- AlterTable
ALTER TABLE "issue" ADD COLUMN     "creator_id" INTEGER,
ADD COLUMN     "due_date" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
