/*
  Warnings:

  - The primary key for the `comment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "board" DROP CONSTRAINT "board_project_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_issue_id_board_id_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_user_id_fkey";

-- DropForeignKey
ALTER TABLE "contribution" DROP CONSTRAINT "contribution_board_id_fkey";

-- DropForeignKey
ALTER TABLE "contribution" DROP CONSTRAINT "contribution_user_id_fkey";

-- DropForeignKey
ALTER TABLE "issue" DROP CONSTRAINT "issue_board_id_fkey";

-- DropForeignKey
ALTER TABLE "star" DROP CONSTRAINT "star_project_id_fkey";

-- DropForeignKey
ALTER TABLE "star" DROP CONSTRAINT "star_user_id_fkey";

-- AlterTable
ALTER TABLE "comment" DROP CONSTRAINT "comment_pkey",
ADD CONSTRAINT "comment_pkey" PRIMARY KEY ("issue_id", "board_id", "user_id");

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "star" ADD CONSTRAINT "star_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board" ADD CONSTRAINT "board_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution" ADD CONSTRAINT "contribution_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribution" ADD CONSTRAINT "contribution_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_issue_id_board_id_fkey" FOREIGN KEY ("issue_id", "board_id") REFERENCES "issue"("id", "board_id") ON DELETE CASCADE ON UPDATE CASCADE;
