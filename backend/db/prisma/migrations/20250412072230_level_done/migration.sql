/*
  Warnings:

  - You are about to drop the column `role` on the `Assignment` table. All the data in the column will be lost.
  - Added the required column `level` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "role",
ADD COLUMN     "level" "Permission" NOT NULL;
