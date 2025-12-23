'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home } from 'lucide-react'
import { useState } from 'react'
import { BRANCH_CONFIG, SEMESTERS } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const branches = Object.values(BRANCH_CONFIG)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-all cursor-pointer hover:scale-105"
          >
            <Home className="h-6 w-6" />
            <span className="hidden sm:inline">BTech Papers</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {branches.map((branch) => (
              <DropdownMenu key={branch.slug}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-sm font-medium bg-gray-100 transition-all cursor-pointer hover:scale-105",
                      pathname?.startsWith(`/${branch.slug}`) 
                        ? "bg-gray-100 shadow-sm" 
                        : "hover:bg-gray-200"
                    )}
                  >
                    <div className={`h-2 w-2 rounded-full ${branch.color} mr-2`} />
                    {branch.shortName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>{branch.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {SEMESTERS.map((sem) => (
                    <DropdownMenuItem key={sem} asChild>
                      <Link
                        href={`/${branch.slug}/${sem}`}
                        className={cn(
                          "cursor-pointer w-full",
                          pathname === `/${branch.slug}/${sem}` && "bg-gray-100 font-medium"
                        )}
                      >
                        Semester {sem}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="cursor-pointer hover:scale-110 transition-transform"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {branches.map((branch) => (
              <div key={branch.slug} className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-900">
                  <div className={`h-2 w-2 rounded-full ${branch.color}`} />
                  {branch.name}
                </div>
                <div className="ml-6 space-y-1">
                  {SEMESTERS.map((sem) => (
                    <Link
                      key={sem}
                      href={`/${branch.slug}/${sem}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-all cursor-pointer",
                        pathname === `/${branch.slug}/${sem}`
                          ? "bg-gray-100 text-gray-900 font-medium shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                      )}
                    >
                      Semester {sem}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
