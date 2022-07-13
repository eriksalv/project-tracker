-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_assignee_id_fkey";

-- AlterTable
ALTER TABLE "issue" ALTER COLUMN "assignee_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
