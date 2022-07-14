/*
  Warnings:

  - The primary key for the `issue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `board_id` to the `comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_issue_id_fkey";

-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "board_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "issue" DROP CONSTRAINT "issue_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "issue_pkey" PRIMARY KEY ("board_id", "id");
DROP SEQUENCE "issue_id_seq";

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_issue_id_board_id_fkey" FOREIGN KEY ("issue_id", "board_id") REFERENCES "issue"("id", "board_id") ON DELETE RESTRICT ON UPDATE CASCADE;
