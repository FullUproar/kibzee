"use client"

import Link from "next/link"
import { Calendar, MapPin, Clock, Bookmark, Star } from "lucide-react"
import { useState } from "react"

interface EventCardProps {
  event: {
    id: string
    title: string
    slug: string
    shortDescription?: string | null
    category: string
    startDate: string | Date
    doorTime?: string | Date | null
    priceMin?: number | null
    priceMax?: number | null
    isFree: boolean
    imageUrl?: string | null
    isCuratedPick: boolean
    featured: boolean
    venue: {
      name: string
      slug: string
      city: string
      state: string
    }
    artists?: Array<{
      artist: {
        name: string
        slug: string
      }
      role?: string | null
    }>
    curator?: {
      name?: string | null
      curatorProfile?: {
        displayName: string
      } | null
    } | null
    curatorNotes?: string | null
  }
  showCuratorNote?: boolean
  onSave?: (eventId: string) => void
  isSaved?: boolean
}

const categoryColors: Record<string, string> = {
  CONCERT: "bg-sage/20 text-sage",
  THEATER: "bg-clay/20 text-clay",
  MUSICAL: "bg-gold/20 text-gold",
  GALLERY_OPENING: "bg-purple-100 text-purple-700",
  POETRY_READING: "bg-blue-100 text-blue-700",
  DANCE: "bg-pink-100 text-pink-700",
  FILM: "bg-gray-100 text-gray-700",
  LITERARY: "bg-amber-100 text-amber-700",
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

export default function EventCard({
  event,
  showCuratorNote = false,
  onSave,
  isSaved = false,
}: EventCardProps) {
  const [saved, setSaved] = useState(isSaved)

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

  const formatPrice = () => {
    if (event.isFree) return "Free"
    if (!event.priceMin) return "Price TBD"
    if (event.priceMin === event.priceMax || !event.priceMax) {
      return `$${(event.priceMin / 100).toFixed(0)}`
    }
    return `$${(event.priceMin / 100).toFixed(0)}-$${(event.priceMax / 100).toFixed(0)}`
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSaved(!saved)
    onSave?.(event.id)
  }

  const headliner = event.artists?.find((a) => a.role === "headliner")?.artist
  const curatorName =
    event.curator?.curatorProfile?.displayName || event.curator?.name

  return (
    <Link href={`/events/${event.slug}`}>
      <article className="card group hover:-translate-y-1 transition-all duration-200 overflow-hidden">
        {/* Image or Gradient */}
        <div className="relative h-40 bg-gradient-to-br from-sage/30 to-clay/30">
          {event.imageUrl && (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                categoryColors[event.category] || "bg-gray-100 text-gray-700"
              }`}
            >
              {categoryLabels[event.category] || event.category}
            </span>
          </div>

          {/* Curated Pick Badge */}
          {event.isCuratedPick && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-clay text-white rounded-full text-xs font-medium">
                <Star className="w-3 h-3 fill-current" />
                Curated Pick
              </span>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          >
            <Bookmark
              className={`w-4 h-4 ${
                saved ? "fill-sage text-sage" : "text-gray-600"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-serif text-lg text-ink group-hover:text-sage transition-colors line-clamp-2">
            {event.title}
          </h3>

          {headliner && (
            <p className="text-sm text-gray-600 mt-1">{headliner.name}</p>
          )}

          {event.shortDescription && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {event.shortDescription}
            </p>
          )}

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-sage" />
              <span>{formattedDate}</span>
              <Clock className="w-4 h-4 text-sage ml-2" />
              <span>{formattedTime}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-clay" />
              <span className="truncate">
                {event.venue.name}, {event.venue.city}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-sm font-medium ${
                event.isFree ? "text-sage" : "text-ink"
              }`}
            >
              {formatPrice()}
            </span>
          </div>

          {/* Curator Note */}
          {showCuratorNote && event.curatorNotes && curatorName && (
            <div className="mt-3 pt-3 border-t border-dust">
              <p className="text-sm text-gray-600 italic line-clamp-2">
                "{event.curatorNotes}"
              </p>
              <p className="text-xs text-gray-500 mt-1">— {curatorName}</p>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
