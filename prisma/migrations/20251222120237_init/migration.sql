-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_papers" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_papers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_slug_key" ON "branches"("slug");

-- CreateIndex
CREATE INDEX "subjects_branchId_semester_idx" ON "subjects"("branchId", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_code_branchId_key" ON "subjects"("code", "branchId");

-- CreateIndex
CREATE INDEX "question_papers_subjectId_idx" ON "question_papers"("subjectId");

-- CreateIndex
CREATE INDEX "question_papers_year_idx" ON "question_papers"("year");

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_papers" ADD CONSTRAINT "question_papers_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
