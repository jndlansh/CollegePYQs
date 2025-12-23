export default function SubjectLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center space-x-2">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
        </div>

        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="h-8 bg-gray-300 rounded-lg w-24 mb-4 animate-pulse" />
          <div className="h-10 bg-gray-300 rounded-lg w-96 mb-2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-lg w-48 animate-pulse" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="h-8 bg-gray-300 rounded-lg w-40 mb-4 animate-pulse" />
              <div className="h-12 bg-gray-100 rounded-lg mb-4 animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PDF Viewer Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md h-[800px] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4 animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full" />
                </div>
                <div className="h-8 bg-gray-300 rounded-lg w-64 mx-auto mb-2 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded-lg w-80 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
