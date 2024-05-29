/*
  Warnings:

  - Added the required column `project_id` to the `column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "column" ADD COLUMN     "project_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "column" ADD CONSTRAINT "column_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
