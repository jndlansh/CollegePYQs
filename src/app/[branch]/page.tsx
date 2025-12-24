import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BRANCH_CONFIG, SEMESTERS, type BranchSlug } from '@/lib/constants'

interface BranchPageProps {
  params: Promise<{ branch: string }>
}

export default async function BranchPage({ params }: BranchPageProps) {
  const { branch: branchSlug } = await params

  // Validate branch
  if (!(branchSlug in BRANCH_CONFIG)) {
    notFound()
  }

  const branch = BRANCH_CONFIG[branchSlug as BranchSlug]

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
            <li className="font-medium text-gray-900 dark:text-gray-100">{branch.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className={`inline-block px-4 py-2 rounded-lg ${branch.lightColor} ${branch.textColor} text-sm font-semibold mb-4`}>
            {branch.slug.toUpperCase()}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {branch.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select a semester to view subjects and question papers
          </p>
        </header>

        {/* Semester Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl">
          {SEMESTERS.map((semester) => (
            <Link
              key={semester}
              href={`/${branchSlug}/${semester}`}
              className="group relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 p-8 shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 dark:from-white/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-gray-100">{semester}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Semester {semester}
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-3 right-3 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-gray-700 dark:text-gray-300">
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// Generate static params for all branches
export async function generateStaticParams() {
  return Object.keys(BRANCH_CONFIG).map((branch) => ({
    branch,
  }))
}
