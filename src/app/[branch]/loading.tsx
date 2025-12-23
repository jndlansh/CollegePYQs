export default function BranchLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <header className="mb-12">
          <div className="h-8 bg-gray-300 rounded-lg w-24 mb-4 animate-pulse" />
          <div className="h-10 bg-gray-300 rounded-lg w-96 mb-2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-64 animate-pulse" />
        </header>

        {/* Semester Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-gray-300 p-8 h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
