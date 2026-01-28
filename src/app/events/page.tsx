"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import EventCard from "@/components/events/event-card"
import EventFilters, { FilterState } from "@/components/events/event-filters"
import { Calendar, Loader2 } from "lucide-react"
import Link from "next/link"
import PublicHeader from "@/components/layout/public-header"

interface Event {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  category: string
  startDate: string
  doorTime: string | null
  priceMin: number | null
  priceMax: number | null
  isFree: boolean
  imageUrl: string | null
  isCuratedPick: boolean
  featured: boolean
  curatorNotes: string | null
  venue: {
    id: string
    name: string
    slug: string
    city: string
    state: string
    address: string
  }
  artists: Array<{
    artist: {
      id: string
      name: string
      slug: string
      primaryGenre: string | null
    }
    role: string | null
  }>
  curator: {
    id: string
    name: string | null
    curatorProfile: {
      displayName: string
    } | null
  } | null
  tags: Array<{
    tag: {
      id: string
      name: string
      slug: string
    }
  }>
}

function EventsContent() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  const initialCategory = searchParams.get("category") || ""

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: initialCategory,
    city: "",
    dateRange: "upcoming",
    priceRange: "all",
  })

  const fetchEvents = useCallback(async (newOffset = 0, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.search) params.set("search", filters.search)
      if (filters.category) params.set("category", filters.category)
      if (filters.city) params.set("city", filters.city)
      if (filters.priceRange === "free") params.set("free", "true")

      // Handle date ranges
      const now = new Date()
      if (filters.dateRange === "this-week") {
        const endOfWeek = new Date(now)
        endOfWeek.setDate(now.getDate() + (7 - now.getDay()))
        params.set("endDate", endOfWeek.toISOString())
      } else if (filters.dateRange === "this-month") {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        params.set("endDate", endOfMonth.toISOString())
      }

      params.set("limit", "12")
      params.set("offset", String(newOffset))

      const response = await fetch(`/api/events?${params.toString()}`)
      const data = await response.json()

      if (append) {
        setEvents((prev) => [...prev, ...data.events])
      } else {
        setEvents(data.events)
      }
      setTotal(data.total)
      setHasMore(data.hasMore)
      setOffset(newOffset)
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEvents(0)
  }, [fetchEvents])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const loadMore = () => {
    fetchEvents(offset + 12, true)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-serif text-ink mb-2">
          Discover Events
        </h1>
        <p className="text-gray-600">
          Find concerts, theater, gallery openings, and more in Michiana
        </p>
      </div>

      {/* Filters */}
      <EventFilters
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {total} {total === 1 ? "event" : "events"} found
        </p>
      )}

      {/* Events Grid */}
      {loading && events.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-sage animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-ink mb-2">
            No events found
          </h2>
          <p className="text-gray-500 mb-6">
            Try adjusting your filters or check back later
          </p>
          <Link href="/concierge" className="btn btn-primary">
            Ask the Concierge
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showCuratorNote={event.isCuratedPick}
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

function EventsLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-display-sm font-serif text-ink mb-2">
          Discover Events
        </h1>
        <p className="text-gray-600">
          Find concerts, theater, gallery openings, and more in Michiana
        </p>
      </div>
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    </main>
  )
}

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <PublicHeader currentPage="events" />

      <Suspense fallback={<EventsLoading />}>
        <EventsContent />
      </Suspense>

      {/* Footer */}
      <footer className="bg-white border-t border-dust mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
