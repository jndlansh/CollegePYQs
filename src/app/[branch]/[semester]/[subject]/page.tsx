import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { BRANCH_CONFIG, type BranchSlug } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { getSignedUrl } from '@/lib/actions/storage'
import SearchBar from '@/components/SearchBar'
import PDFViewer from '@/components/PDFViewer'

interface SubjectPageProps {
  params: Promise<{ branch: string; semester: string; subject: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const { branch: branchSlug, semester: semesterParam, subject: subjectCode } = await params
  const { search, paper } = await searchParams

  // Validate branch
  if (!(branchSlug in BRANCH_CONFIG)) {
    notFound()
  }

  const branch = BRANCH_CONFIG[branchSlug as BranchSlug]
  const semester = parseInt(semesterParam)

  // Fetch subject with question papers
  const subject = await prisma.subject.findFirst({
    where: {
      code: {
        equals: subjectCode,
        mode: 'insensitive',
      },
      branch: {
        slug: branchSlug,
      },
      semester,
    },
    include: {
      questionPapers: {
        orderBy: {
          year: 'desc',
        },
      },
    },
  })

  if (!subject) {
    notFound()
  }

  // Filter papers based on search
  const searchTerm = typeof search === 'string' ? search.toLowerCase() : ''
  const filteredPapers = searchTerm
    ? subject.questionPapers.filter((paper) =>
        paper.year.toString().includes(searchTerm)
      )
    : subject.questionPapers

  // Get selected paper for viewing
  const selectedPaperId = typeof paper === 'string' ? paper : null
  const selectedPaper = selectedPaperId
    ? subject.questionPapers.find((p) => p.id === selectedPaperId)
    : null

  // Generate signed URL if paper is selected
  let signedUrl: string | null = null
  if (selectedPaper) {
    signedUrl = await getSignedUrl(selectedPaper.fileUrl)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${branchSlug}`} className="hover:text-gray-900 dark:hover:text-gray-100">
                {branch.name}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/${branchSlug}/${semester}`}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                Semester {semester}
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100">{subject.code}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div
            className={`inline-block px-4 py-2 rounded-lg ${branch.lightColor} ${branch.textColor} text-sm font-semibold mb-4`}
          >
            {subject.code}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {subject.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {subject.questionPapers.length} question paper
            {subject.questionPapers.length !== 1 ? 's' : ''} available
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Question Papers List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Question Papers
              </h2>

              {/* Search Bar */}
              <div className="mb-4">
                <Suspense fallback={<div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />}>
                  <SearchBar />
                </Suspense>
              </div>

              {/* Papers List */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredPapers.length > 0 ? (
                  filteredPapers.map((qPaper) => (
                    <Link
                      key={qPaper.id}
                      href={`?${new URLSearchParams({
                        ...(searchTerm && { search: searchTerm }),
                        paper: qPaper.id,
                      })}`}
                      className={`block p-4 rounded-lg transition-all ${
                        selectedPaperId === qPaper.id
                          ? `${branch.lightColor} ${branch.textColor} ring-2 ring-offset-2`
                          : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                      scroll={false}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">Year {qPaper.year}</div>
                          <div className="text-xs opacity-75">
                            {subject.code}
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No papers found</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">Try a different search term</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - PDF Viewer */}
          <div className="lg:col-span-2">
            {selectedPaper && signedUrl ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-[800px]">
                <PDFViewer
                  fileUrl={signedUrl}
                  fileName={`${subject.code}_${selectedPaper.year}.pdf`}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center h-[800px] flex items-center justify-center">
                <div>
                  <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <svg
                      className="w-16 h-16 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Select a Paper to View
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a question paper from the list to view it here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
