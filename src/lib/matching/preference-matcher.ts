import { prisma } from "@/lib/prisma"
import { Event, UserPreferences, Venue } from "@prisma/client"

interface MatchScore {
  userId: string
  score: number
  breakdown: {
    category: number
    genre: number
    price: number
    day: number
    distance: number
  }
}

interface EventWithVenue extends Event {
  venue: Venue
}

/**
 * Calculate the match score between a user's preferences and an event
 *
 * Scoring breakdown:
 * - Category match: 0-30 points
 * - Genre match: 0-25 points
 * - Price range: 0-20 points
 * - Preferred day: 0-15 points
 * - Distance: 0-10 points
 *
 * Total: 0-100 points
 */
export function calculateMatchScore(
  preferences: UserPreferences,
  event: EventWithVenue
): MatchScore["breakdown"] {
  const breakdown = {
    category: 0,
    genre: 0,
    price: 0,
    day: 0,
    distance: 0,
  }

  // Category match (0-30 points)
  const categories = preferences.categories as Record<string, number>
  if (categories && categories[event.category]) {
    // Interest level is 1-5, convert to 0-30 points
    breakdown.category = (categories[event.category] / 5) * 30
  }

  // Genre match (0-25 points)
  // Events can have tags that match user's preferred genres
  // For now, we'll give partial credit based on category affinity
  // This can be expanded when we add tags to events
  if (preferences.genres && preferences.genres.length > 0) {
    // Give 15 points if the category aligns with their genres
    // This is a simplified version - in production you'd match against event tags
    const genreCategories: Record<string, string[]> = {
      "jazz": ["CONCERT"],
      "rock": ["CONCERT"],
      "indie": ["CONCERT"],
      "classical": ["CONCERT", "THEATER"],
      "comedy": ["THEATER"],
      "drama": ["THEATER", "FILM"],
      "dance": ["DANCE"],
      "poetry": ["POETRY_READING", "LITERARY"],
      "visual art": ["GALLERY_OPENING"],
    }

    for (const genre of preferences.genres) {
      const matchingCategories = genreCategories[genre.toLowerCase()] || []
      if (matchingCategories.includes(event.category)) {
        breakdown.genre = 25
        break
      }
    }
  } else {
    // No genre preferences = neutral, give half points
    breakdown.genre = 12.5
  }

  // Price range (0-20 points)
  if (event.isFree && preferences.includeFreeEvents) {
    breakdown.price = 20
  } else if (!event.isFree) {
    const eventMinPrice = event.priceMin || 0
    const eventMaxPrice = event.priceMax || event.priceMin || 0
    const userMinPrice = preferences.priceMin || 0
    const userMaxPrice = preferences.priceMax || Infinity

    // Check if event price range overlaps with user's price range
    if (eventMinPrice <= userMaxPrice && eventMaxPrice >= userMinPrice) {
      // Full overlap = full points
      if (eventMinPrice >= userMinPrice && eventMaxPrice <= userMaxPrice) {
        breakdown.price = 20
      } else {
        // Partial overlap
        breakdown.price = 10
      }
    }
  } else if (event.isFree && !preferences.includeFreeEvents) {
    breakdown.price = 5 // Some credit for free events even if not preferred
  }

  // Preferred day (0-15 points)
  if (preferences.preferredDays && preferences.preferredDays.length > 0) {
    const eventDay = new Date(event.startDate).toLocaleDateString("en-US", {
      weekday: "long"
    }).toLowerCase()

    if (preferences.preferredDays.includes(eventDay)) {
      breakdown.day = 15
    }
  } else {
    // No day preference = neutral, give half points
    breakdown.day = 7.5
  }

  // Distance (0-10 points)
  if (preferences.homeLatitude && preferences.homeLongitude &&
      event.venue.latitude && event.venue.longitude) {
    const distance = calculateDistance(
      preferences.homeLatitude,
      preferences.homeLongitude,
      event.venue.latitude,
      event.venue.longitude
    )

    const maxDistance = preferences.maxDistance || 50 // Default 50 miles

    if (distance <= maxDistance) {
      // Closer = more points, using linear scale
      breakdown.distance = Math.max(0, (1 - distance / maxDistance) * 10)
    }
  } else {
    // No location data = neutral, give half points
    breakdown.distance = 5
  }

  return breakdown
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

/**
 * Find all users who should be notified about a new event
 * Returns users with match score >= 60 for in-app notifications
 * and users with score >= 80 for email digest inclusion
 */
export async function findMatchingUsers(
  event: EventWithVenue
): Promise<{
  inAppNotifications: MatchScore[]
  emailDigestUsers: MatchScore[]
}> {
  // Get all users with preferences who want to receive match notifications
  const usersWithPreferences = await prisma.userPreferences.findMany({
    where: {
      notifyMatches: true,
    },
  })

  const inAppNotifications: MatchScore[] = []
  const emailDigestUsers: MatchScore[] = []

  for (const preferences of usersWithPreferences) {
    const breakdown = calculateMatchScore(preferences, event)
    const totalScore =
      breakdown.category +
      breakdown.genre +
      breakdown.price +
      breakdown.day +
      breakdown.distance

    const matchScore: MatchScore = {
      userId: preferences.userId,
      score: totalScore,
      breakdown,
    }

    // Score >= 60: in-app notification
    if (totalScore >= 60) {
      inAppNotifications.push(matchScore)
    }

    // Score >= 80: include in email digest
    if (totalScore >= 80) {
      emailDigestUsers.push(matchScore)
    }
  }

  return {
    inAppNotifications,
    emailDigestUsers,
  }
}

/**
 * Create notifications for users who match a newly published event
 */
export async function createEventNotifications(
  event: EventWithVenue
): Promise<{ created: number }> {
  const { inAppNotifications } = await findMatchingUsers(event)

  if (inAppNotifications.length === 0) {
    return { created: 0 }
  }

  // Create notifications for all matching users
  const notifications = await prisma.notification.createMany({
    data: inAppNotifications.map((match) => ({
      userId: match.userId,
      type: "event_match",
      title: "New event matches your interests!",
      content: `${event.title} - ${Math.round(match.score)}% match`,
      data: {
        eventId: event.id,
        eventSlug: event.slug,
        matchScore: match.score,
        breakdown: match.breakdown,
      },
    })),
    skipDuplicates: true,
  })

  return { created: notifications.count }
}

/**
 * Get recommended events for a user based on their preferences
 */
export async function getRecommendedEvents(
  userId: string,
  limit: number = 10
): Promise<Array<{ event: EventWithVenue; score: number }>> {
  const preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  })

  if (!preferences) {
    return []
  }

  // Get upcoming published events
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: {
        gte: new Date(),
      },
    },
    include: {
      venue: true,
    },
    orderBy: {
      startDate: "asc",
    },
    take: 100, // Get more events to filter
  })

  // Score each event
  const scoredEvents = events.map((event) => {
    const breakdown = calculateMatchScore(preferences, event)
    const score =
      breakdown.category +
      breakdown.genre +
      breakdown.price +
      breakdown.day +
      breakdown.distance

    return { event, score }
  })

  // Sort by score and return top matches
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
