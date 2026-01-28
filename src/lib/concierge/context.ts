import { prisma } from "@/lib/prisma"
import { EventCategory } from "@prisma/client"

export interface ConciergeEvent {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string | null
  category: EventCategory
  startDate: Date
  endDate: Date | null
  priceMin: number | null
  priceMax: number | null
  isFree: boolean
  isCuratedPick: boolean
  curatorNotes: string | null
  venue: {
    name: string
    city: string
    address: string
  }
  artists: Array<{
    name: string
    role: string | null
  }>
}

export interface ConciergePreferences {
  categories: Record<string, number>
  genres: string[]
  priceMax: number | null
  includeFreeEvents: boolean
  preferredDays: string[]
  preferredTimes: string[]
  homeCity: string | null
}

export interface ConciergeContext {
  events: ConciergeEvent[]
  preferences: ConciergePreferences | null
  userName: string | null
}

export async function buildConciergeContext(
  userId: string | null
): Promise<ConciergeContext> {
  // Fetch upcoming events
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { gte: new Date() },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      shortDescription: true,
      category: true,
      startDate: true,
      endDate: true,
      priceMin: true,
      priceMax: true,
      isFree: true,
      isCuratedPick: true,
      curatorNotes: true,
      venue: {
        select: {
          name: true,
          city: true,
          address: true,
        },
      },
      artists: {
        select: {
          artist: {
            select: {
              name: true,
            },
          },
          role: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { startDate: "asc" },
    take: 30, // Limit to 30 upcoming events for context window
  })

  const formattedEvents: ConciergeEvent[] = events.map((event) => ({
    ...event,
    artists: event.artists.map((ea) => ({
      name: ea.artist.name,
      role: ea.role,
    })),
  }))

  // Fetch user preferences if logged in
  let preferences: ConciergePreferences | null = null
  let userName: string | null = null

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        preferences: true,
      },
    })

    if (user) {
      userName = user.name
      if (user.preferences) {
        preferences = {
          categories: user.preferences.categories as Record<string, number>,
          genres: user.preferences.genres,
          priceMax: user.preferences.priceMax,
          includeFreeEvents: user.preferences.includeFreeEvents,
          preferredDays: user.preferences.preferredDays,
          preferredTimes: user.preferences.preferredTimes,
          homeCity: user.preferences.homeCity,
        }
      }
    }
  }

  return {
    events: formattedEvents,
    preferences,
    userName,
  }
}

export function buildEventContext(events: ConciergeEvent[]): string {
  if (events.length === 0) {
    return "No upcoming events found in the database."
  }

  const eventList = events
    .map((event) => {
      const date = new Date(event.startDate)
      const dateStr = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
      const timeStr = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })

      const price = event.isFree
        ? "Free"
        : event.priceMin
          ? `$${event.priceMin / 100}${event.priceMax && event.priceMax !== event.priceMin ? `-$${event.priceMax / 100}` : ""}`
          : "Price TBD"

      const artists =
        event.artists.length > 0
          ? `Featuring: ${event.artists.map((a) => a.name).join(", ")}`
          : ""

      const curatorNote =
        event.isCuratedPick && event.curatorNotes
          ? `[Curated Pick: "${event.curatorNotes}"]`
          : ""

      return `
EVENT: ${event.title}
Category: ${formatCategory(event.category)}
Date: ${dateStr} at ${timeStr}
Venue: ${event.venue.name}, ${event.venue.city}
Price: ${price}
${artists}
${event.shortDescription || event.description.slice(0, 200)}
${curatorNote}
---`.trim()
    })
    .join("\n\n")

  return `
## Available Events (${events.length} upcoming)
When recommending events, use the exact event names below.

${eventList}
`
}

function formatCategory(category: EventCategory): string {
  const labels: Record<EventCategory, string> = {
    CONCERT: "Concert",
    THEATER: "Theater",
    MUSICAL: "Musical",
    GALLERY_OPENING: "Gallery Opening",
    POETRY_READING: "Poetry Reading",
    DANCE: "Dance",
    FILM: "Film",
    LITERARY: "Literary",
  }
  return labels[category]
}
