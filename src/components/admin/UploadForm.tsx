'use client'

import { useState } from 'react'
import { uploadQuestionPaper } from '@/lib/actions/upload'

interface Branch {
  id: string
  name: string
  slug: string
  subjects: Subject[]
}

interface Subject {
  id: string
  name: string
  code: string
  semester: number
}

interface UploadFormProps {
  branches: Branch[]
}

export default function UploadForm({ branches }: UploadFormProps) {
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Get selected branch
  const selectedBranch = branches.find((b) => b.id === selectedBranchId)

  // Get subjects for selected semester
  const availableSubjects = selectedBranch?.subjects.filter(
    (s) => s.semester === parseInt(selectedSemester)
  ) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!file || !selectedBranchId || !selectedSemester || !selectedSubjectId || !year) {
      setMessage({ type: 'error', text: 'Please fill in all fields' })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('subjectId', selectedSubjectId)
      formData.append('year', year.toString())
      formData.append('branchSlug', selectedBranch?.slug || '')
      formData.append('semester', selectedSemester)

      const result = await uploadQuestionPaper(formData)

      if (result.success) {
        setMessage({ type: 'success', text: 'Question paper uploaded successfully!' })
        // Reset form
        setFile(null)
        setYear(new Date().getFullYear())
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setMessage({ type: 'error', text: result.error || 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
      <div className="space-y-6">
        {/* Branch Selection */}
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
            Branch
          </label>
          <select
            id="branch"
            value={selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value)
              setSelectedSemester('')
              setSelectedSubjectId('')
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} ({branch.slug.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Semester Selection */}
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
            Semester
          </label>
          <select
            id="semester"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value)
              setSelectedSubjectId('')
            }}
            disabled={!selectedBranchId}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">Select semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selection */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            disabled={!selectedSemester}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">Select subject</option>
            {availableSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
          {selectedSemester && availableSubjects.length === 0 && (
            <p className="mt-2 text-sm text-orange-600">
              No subjects found for this semester. Add subjects first using Prisma Studio.
            </p>
          )}
        </div>

        {/* Year Input */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            min="2000"
            max="2100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            PDF File
          </label>
          <input
            type="file"
            id="file-upload"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Question Paper'
          )}
        </button>
      </div>
    </form>
  )
}
