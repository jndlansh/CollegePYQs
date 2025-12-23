import Link from 'next/link'
import { BRANCH_CONFIG } from '@/lib/constants'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            BTech Question Paper Portal
          </h1>
          <p className="text-xl text-gray-600">
            Access past question papers across 8 engineering branches
          </p>
        </header>

        {/* Branch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Object.values(BRANCH_CONFIG).map((branch) => (
            <Link
              key={branch.slug}
              href={`/${branch.slug}`}
              className={`group relative overflow-hidden rounded-2xl ${branch.color} p-8 text-white shadow-lg transition-all duration-300 transform hover:scale-105 ${branch.hoverColor}`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-4xl font-bold mb-3 uppercase">
                  {branch.slug}
                </div>
                <div className="text-sm font-medium opacity-90">
                  {branch.name}
                </div>
                
                {/* Arrow Icon */}
                <div className="absolute bottom-6 right-6 transform transition-transform duration-300 group-hover:translate-x-2">
                  <svg
                    className="w-6 h-6"
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
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">
            Select your branch to browse question papers by semester and subject
          </p>
        </div>
      </div>
    </div>
  )
}

