"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

interface PublicHeaderProps {
  currentPage?: "events" | "concierge" | "home"
}

export default function PublicHeader({ currentPage }: PublicHeaderProps) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  return (
    <header className="bg-white border-b border-dust">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-2xl font-serif text-ink">
              kibzee<span className="text-clay ml-1">•</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/events"
              className={`transition-colors ${
                currentPage === "events"
                  ? "text-sage font-medium"
                  : "text-ink hover:text-sage"
              }`}
            >
              Events
            </Link>
            <Link
              href="/concierge"
              className={`transition-colors ${
                currentPage === "concierge"
                  ? "text-sage font-medium"
                  : "text-ink hover:text-sage"
              }`}
            >
              Concierge
            </Link>
            {isLoading ? (
              <div className="w-20 h-8 bg-dust rounded animate-pulse" />
            ) : session ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
