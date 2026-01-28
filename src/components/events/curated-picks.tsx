"use client"

import Link from "next/link"
import { Star, ArrowRight, Calendar, MapPin } from "lucide-react"

interface CuratedEvent {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  category: string
  startDate: string
  imageUrl: string | null
  curatorNotes: string | null
  venue: {
    name: string
    city: string
  }
  curator: {
    name: string | null
    curatorProfile: {
      displayName: string
    } | null
  } | null
}

interface CuratedPicksProps {
  events: CuratedEvent[]
}

const categoryLabels: Record<string, string> = {
  CONCERT: "Concert",
  THEATER: "Theater",
  MUSICAL: "Musical",
  GALLERY_OPENING: "Gallery",
  POETRY_READING: "Poetry",
  DANCE: "Dance",
  FILM: "Film",
  LITERARY: "Literary",
}

export default function CuratedPicks({ events }: CuratedPicksProps) {
  if (events.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-br from-clay/5 to-gold/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-clay/20 rounded-full">
              <Star className="w-5 h-5 text-clay fill-clay" />
            </div>
            <div>
              <h2 className="text-display-xs font-serif text-ink">
                Curated Picks
              </h2>
              <p className="text-gray-600 text-sm">
                Hand-selected must-see events from our curators
              </p>
            </div>
          </div>
          <Link
            href="/events?curatedOnly=true"
            className="hidden md:flex items-center gap-2 text-clay hover:text-clay/80 transition-colors text-sm font-medium"
          >
            See all picks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <CuratedPickCard key={event.id} event={event} />
          ))}
        </div>

        <div className="md:hidden mt-6 text-center">
          <Link
            href="/events?curatedOnly=true"
            className="inline-flex items-center gap-2 text-clay hover:text-clay/80 transition-colors text-sm font-medium"
          >
            See all curated picks
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CuratedPickCard({ event }: { event: CuratedEvent }) {
  const startDate = new Date(event.startDate)
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const curatorName =
    event.curator?.curatorProfile?.displayName || event.curator?.name || "Kibzee Curator"

  return (
    <Link href={`/events/${event.slug}`}>
      <article className="group relative bg-white rounded-lg border border-clay/20 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        {/* Curated Pick Ribbon */}
        <div className="absolute top-4 right-0 z-10">
          <div className="bg-clay text-white px-3 py-1 rounded-l-full text-xs font-medium flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-current" />
            Curated Pick
          </div>
        </div>

        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-clay/20 to-gold/20">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-ink">
              {categoryLabels[event.category] || event.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif text-lg text-ink group-hover:text-clay transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-clay" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-clay" />
              <span className="truncate">
                {event.venue.name}, {event.venue.city}
              </span>
            </div>
          </div>

          {/* Curator Note */}
          {event.curatorNotes && (
            <div className="mt-4 pt-4 border-t border-dust">
              <p className="text-sm text-gray-600 italic line-clamp-2">
                "{event.curatorNotes}"
              </p>
              <p className="text-xs text-clay mt-2 font-medium">
                — {curatorName}
              </p>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
