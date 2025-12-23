import { prisma } from '@/lib/prisma'
import UploadForm from '@/components/admin/UploadForm'
import Link from 'next/link'

export default async function AdminUploadPage() {
  // Fetch all branches with their subjects
  const branches = await prisma.branch.findMany({
    include: {
      subjects: {
        orderBy: [{ semester: 'asc' }, { code: 'asc' }],
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Question Paper</h1>
          <p className="text-gray-600">Add new question papers to the database</p>
        </div>

        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Upload Form */}
        <UploadForm branches={branches} />

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Instructions</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Select the branch, semester, and subject for the question paper</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Enter the year of the exam</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Choose a PDF file from your computer (max 10MB recommended)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Click &quot;Upload Question Paper&quot; to save it to the database</span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> Files will be stored in Supabase Storage with the path format:
            <code className="ml-1 px-2 py-0.5 bg-blue-100 rounded">
              branch/semX/SUBJECTCODE_YEAR.pdf
            </code>
          </p>
        </div>
      </div>
    </div>
  )
}
