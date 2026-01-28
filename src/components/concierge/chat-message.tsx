"use client"

import Link from "next/link"
import { User, Sparkles, Calendar, MapPin } from "lucide-react"

interface EventPreview {
  id: string
  title: string
  slug: string
  shortDescription: string | null
  category: string
  startDate: string
  priceMin: number | null
  priceMax: number | null
  isFree: boolean
  imageUrl: string | null
  isCuratedPick: boolean
  venue: {
    name: string
    city: string
    slug: string
  }
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  events?: EventPreview[]
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

export default function ChatMessage({ role, content, events }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-sage/20" : "bg-clay/20"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-sage" />
        ) : (
          <Sparkles className="w-4 h-4 text-clay" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block max-w-[85%] p-4 rounded-lg ${
            isUser
              ? "bg-sage text-white rounded-br-none"
              : "bg-white border border-dust rounded-bl-none"
          }`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {/* Event Cards */}
        {!isUser && events && events.length > 0 && (
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <EventPreviewCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EventPreviewCard({ event }: { event: EventPreview }) {
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

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block bg-white border border-dust rounded-lg p-4 hover:border-sage transition-colors max-w-md"
    >
      <div className="flex gap-3">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-16 h-16 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded bg-gradient-to-br from-sage/30 to-clay/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🎭</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-dust rounded-full text-gray-600">
              {categoryLabels[event.category] || event.category}
            </span>
            {event.isCuratedPick && (
              <span className="text-xs px-2 py-0.5 bg-clay/20 text-clay rounded-full">
                Curated
              </span>
            )}
          </div>
          <h4 className="font-medium text-ink text-sm line-clamp-1">
            {event.title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate} {formattedTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.venue.name}
            </span>
          </div>
          <p className="text-xs text-sage font-medium mt-1">{formatPrice()}</p>
        </div>
      </div>
    </Link>
  )
}
