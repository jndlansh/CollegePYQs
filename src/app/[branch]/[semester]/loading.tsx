export default function SemesterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <header className="mb-12">
          <div className="h-8 bg-gray-300 rounded-lg w-32 mb-4 animate-pulse" />
          <div className="h-10 bg-gray-300 rounded-lg w-80 mb-2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
        </header>

        {/* Subjects Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-6 bg-gray-300 rounded w-20 animate-pulse" />
                <div className="h-5 bg-gray-300 rounded w-5 animate-pulse" />
              </div>
              <div className="h-6 bg-gray-300 rounded w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
