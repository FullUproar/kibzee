import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { getRecommendedEvents } from "./preference-matcher"

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000"

interface DigestUser {
  id: string
  name: string | null
  email: string
}

/**
 * Send weekly digest emails to users who have opted in
 * This should be called by a cron job (e.g., every Monday at 8am)
 */
export async function sendWeeklyDigests(): Promise<{
  sent: number
  failed: number
  skipped: number
}> {
  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
  }

  // Get users who want weekly digests
  const usersWithDigestPrefs = await prisma.userPreferences.findMany({
    where: {
      notifyWeekly: true,
      emailDigest: {
        in: ["weekly"],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  for (const prefs of usersWithDigestPrefs) {
    const user = prefs.user
    if (!user.email) {
      results.skipped++
      continue
    }

    try {
      // Get recommended events for this user
      const recommendations = await getRecommendedEvents(user.id, 5)

      if (recommendations.length === 0) {
        results.skipped++
        continue
      }

      // Format events for the email template
      const events = await Promise.all(
        recommendations.map(async ({ event }) => {
          const startDate = new Date(event.startDate)
          return {
            title: event.title,
            category: formatCategory(event.category),
            date: startDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }),
            venue: event.venue.name,
            url: `${BASE_URL}/events/${event.slug}`,
          }
        })
      )

      await sendEmail({
        to: user.email,
        subject: "This Week in Michiana - Your Personalized Event Guide",
        template: "weekly-digest",
        data: {
          name: user.name || "Friend",
          events,
          eventsUrl: `${BASE_URL}/events`,
          unsubscribeUrl: `${BASE_URL}/dashboard/preferences`,
        },
      })

      results.sent++
    } catch (error) {
      console.error(`Failed to send digest to ${user.email}:`, error)
      results.failed++
    }
  }

  return results
}

/**
 * Send daily digest emails to users who have opted in
 */
export async function sendDailyDigests(): Promise<{
  sent: number
  failed: number
  skipped: number
}> {
  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
  }

  // Get users who want daily digests
  const usersWithDigestPrefs = await prisma.userPreferences.findMany({
    where: {
      emailDigest: "daily",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  for (const prefs of usersWithDigestPrefs) {
    const user = prefs.user
    if (!user.email) {
      results.skipped++
      continue
    }

    try {
      // Get events happening tomorrow that match user preferences
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      const dayAfter = new Date(tomorrow)
      dayAfter.setDate(dayAfter.getDate() + 1)

      const recommendations = await getRecommendedEvents(user.id, 10)

      // Filter to only tomorrow's events
      const tomorrowEvents = recommendations.filter(({ event }) => {
        const eventDate = new Date(event.startDate)
        return eventDate >= tomorrow && eventDate < dayAfter
      })

      if (tomorrowEvents.length === 0) {
        results.skipped++
        continue
      }

      const events = tomorrowEvents.map(({ event }) => {
        const startDate = new Date(event.startDate)
        return {
          title: event.title,
          category: formatCategory(event.category),
          date: startDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
          venue: event.venue.name,
          url: `${BASE_URL}/events/${event.slug}`,
        }
      })

      await sendEmail({
        to: user.email,
        subject: "Tomorrow in Michiana - Events Matching Your Interests",
        template: "weekly-digest", // Reuse the same template
        data: {
          name: user.name || "Friend",
          events,
          eventsUrl: `${BASE_URL}/events`,
          unsubscribeUrl: `${BASE_URL}/dashboard/preferences`,
        },
      })

      results.sent++
    } catch (error) {
      console.error(`Failed to send daily digest to ${user.email}:`, error)
      results.failed++
    }
  }

  return results
}

/**
 * Send a notification email for a high-match event
 */
export async function sendEventMatchEmail(
  user: DigestUser,
  eventData: {
    id: string
    slug: string
    title: string
    description: string | null
    startDate: Date
    isCuratedPick: boolean
    curatorNotes: string | null
    venue: { name: string }
    curator?: { name: string | null }
  }
): Promise<void> {
  if (!user.email) return

  const startDate = new Date(eventData.startDate)

  await sendEmail({
    to: user.email,
    subject: `New Event: ${eventData.title}`,
    template: "new-event-match",
    data: {
      name: user.name || "Friend",
      eventTitle: eventData.title,
      eventDescription: eventData.description || "A great event you won't want to miss!",
      eventDate: startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      venueName: eventData.venue.name,
      isCuratedPick: eventData.isCuratedPick,
      curatorNote: eventData.curatorNotes,
      curatorName: eventData.curator?.name || "Kibzee Curator",
      eventUrl: `${BASE_URL}/events/${eventData.slug}`,
    },
  })
}

function formatCategory(category: string): string {
  const categoryLabels: Record<string, string> = {
    CONCERT: "Concert",
    THEATER: "Theater",
    MUSICAL: "Musical",
    GALLERY_OPENING: "Gallery Opening",
    POETRY_READING: "Poetry Reading",
    DANCE: "Dance",
    FILM: "Film",
    LITERARY: "Literary",
  }
  return categoryLabels[category] || category
}
