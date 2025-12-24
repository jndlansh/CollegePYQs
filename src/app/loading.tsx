export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <header className="text-center mb-16">
          <div className="h-14 bg-gray-300 rounded-lg w-2/3 mx-auto mb-4 animate-pulse" />
          <div className="h-7 bg-gray-200 rounded-lg w-1/2 mx-auto animate-pulse" />
        </header>

        {/* Branch Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-gray-300 p-8 h-40 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
