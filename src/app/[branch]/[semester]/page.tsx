import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BRANCH_CONFIG, SEMESTERS, type BranchSlug } from '@/lib/constants'
import { prisma } from '@/lib/prisma'

interface SemesterPageProps {
  params: Promise<{ branch: string; semester: string }>
}

export default async function SemesterPage({ params }: SemesterPageProps) {
  const { branch: branchSlug, semester: semesterParam } = await params

  // Validate branch
  if (!(branchSlug in BRANCH_CONFIG)) {
    notFound()
  }

  const branch = BRANCH_CONFIG[branchSlug as BranchSlug]
  const semester = parseInt(semesterParam)

  // Validate semester
  if (isNaN(semester) || !SEMESTERS.includes(semester as any)) {
    notFound()
  }

  // Fetch subjects for this branch and semester
  const subjects = await prisma.subject.findMany({
    where: {
      branch: {
        slug: branchSlug,
      },
      semester,
    },
    orderBy: {
      code: 'asc',
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
            <li className="font-medium text-gray-900 dark:text-gray-100">Semester {semester}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className={`inline-block px-4 py-2 rounded-lg ${branch.lightColor} ${branch.textColor} text-sm font-semibold mb-4`}>
            {branch.slug.toUpperCase()} - SEM {semester}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Semester {semester} Subjects
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {subjects.length} subject{subjects.length !== 1 ? 's' : ''} available
          </p>
        </header>

        {/* Subjects List */}
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/${branchSlug}/${semester}/${subject.code.toLowerCase()}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${branch.lightColor} ${branch.textColor}`}>
                    {subject.code}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 transform transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View question papers
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Subjects for this semester will be added soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Generate static params for all branch/semester combinations
export async function generateStaticParams() {
  const params: { branch: string; semester: string }[] = []

  Object.keys(BRANCH_CONFIG).forEach((branch) => {
    SEMESTERS.forEach((semester) => {
      params.push({
        branch,
        semester: semester.toString(),
      })
    })
  })

  return params
}
