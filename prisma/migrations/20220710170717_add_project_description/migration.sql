/*
  Warnings:

  - A unique constraint covering the columns `[owner_id,title]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "project" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "project_owner_id_title_key" ON "project"("owner_id", "title");
