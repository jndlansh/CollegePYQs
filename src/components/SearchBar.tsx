'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  // Sync local state with URL on mount and URL changes
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    setSearchTerm(urlSearch)
  }, [searchParams])

  // Debounced search to update URL
  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (term) {
      params.set('search', term)
    } else {
      params.delete('search')
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, 300)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by year or keyword..."
          className="w-full px-4 py-3 pl-11 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
