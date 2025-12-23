'use client'

import { useState } from 'react'

interface PDFViewerProps {
  fileUrl: string
  fileName: string
}

export default function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">{fileName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={fileUrl}
            download={fileName}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </a>
        </div>
      </div>

      {/* PDF Display using iframe */}
      <div className="flex-1 relative bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-red-50 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-700 font-medium">Failed to load PDF</p>
              <a
                href={fileUrl}
                download={fileName}
                className="mt-4 inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download Instead
              </a>
            </div>
          </div>
        )}
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&view=FitH`}
          className="w-full h-full border-0"
          title={fileName}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false)
            setError(true)
          }}
        />
      </div>
    </div>
  )
}
