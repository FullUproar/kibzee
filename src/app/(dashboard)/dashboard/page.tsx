import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { EventCategory } from "@prisma/client"
import EventCard from "@/components/events/event-card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      preferences: true,
      savedEvents: {
        include: {
          event: {
            include: {
              venue: true,
              artists: {
                include: { artist: true },
                orderBy: { order: "asc" },
              },
              curator: {
                select: {
                  name: true,
                  curatorProfile: { select: { displayName: true } },
                },
              },
            },
          },
        },
        take: 5,
        orderBy: {
          event: {
            startDate: "asc",
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Filter saved events to only show upcoming ones
  const upcomingSavedEvents = user.savedEvents.filter(
    (se) => se.event.startDate >= new Date() && se.event.status === "PUBLISHED"
  )

  const savedEventIds = user.savedEvents.map((se) => se.eventId)

  const hasPreferences = user.preferences && (
    Object.keys(user.preferences.categories as object || {}).length > 0 ||
    user.preferences.genres.length > 0
  )

  // Get recommended events based on preferences
  const preferredCategories = hasPreferences && user.preferences
    ? Object.keys(user.preferences.categories as Record<string, number>) as EventCategory[]
    : []

  const recommendedEvents = hasPreferences && user.preferences
    ? await prisma.event.findMany({
        where: {
          status: "PUBLISHED",
          startDate: { gte: new Date() },
          id: { notIn: savedEventIds },
          ...(preferredCategories.length > 0 && {
            category: { in: preferredCategories },
          }),
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              state: true,
            },
          },
          artists: {
            include: { artist: true },
            orderBy: { order: "asc" },
          },
          curator: {
            select: {
              name: true,
              curatorProfile: { select: { displayName: true } },
            },
          },
        },
        orderBy: [
          { isCuratedPick: "desc" },
          { startDate: "asc" },
        ],
        take: 6,
      })
    : []

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif mb-2">
          Welcome back, {user.name?.split(" ")[0] || "there"}
        </h1>
        <p className="text-gray-600">
          Discover what&apos;s happening in your area
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/events"
          className="card p-6 hover:shadow-medium transition-shadow"
        >
          <div className="text-2xl mb-2">📅</div>
          <h3 className="font-semibold mb-1">Browse Events</h3>
          <p className="text-sm text-gray-600">
            Explore upcoming concerts, shows, and cultural events
          </p>
        </Link>

        <Link
          href="/concierge"
          className="card p-6 hover:shadow-medium transition-shadow"
        >
          <div className="text-2xl mb-2">💬</div>
          <h3 className="font-semibold mb-1">Ask the Concierge</h3>
          <p className="text-sm text-gray-600">
            Get personalized event recommendations
          </p>
        </Link>
      </div>

      {/* Preferences Prompt */}
      {!hasPreferences && (
        <div className="card p-6 mb-8 bg-gold/10 border-gold/30">
          <h3 className="font-semibold mb-2">Set Your Preferences</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tell us what you&apos;re interested in and we&apos;ll recommend events you&apos;ll love.
          </p>
          <Link href="/dashboard/preferences" className="btn btn-primary">
            Set Preferences
          </Link>
        </div>
      )}

      {/* Recommended Events */}
      {recommendedEvents.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif">Recommended for You</h2>
            <Link href="/events" className="text-sage text-sm hover:underline">
              Browse all
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showCuratorNote={event.isCuratedPick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Saved Events */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif">Your Saved Events</h2>
          {upcomingSavedEvents.length > 0 && (
            <Link href="/dashboard/saved" className="text-sage text-sm hover:underline">
              View all
            </Link>
          )}
        </div>

        {upcomingSavedEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">You haven&apos;t saved any events yet.</p>
            <Link href="/events" className="text-sage hover:underline">
              Browse events to find something you&apos;ll love
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingSavedEvents.map(({ event }) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="flex gap-4 p-4 rounded-subtle hover:bg-dust/50 transition-colors"
              >
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-20 h-20 object-cover rounded-subtle"
                  />
                ) : (
                  <div className="w-20 h-20 bg-dust rounded-subtle flex items-center justify-center">
                    <span className="text-2xl">🎭</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.venue.name}</p>
                  <p className="text-sm text-sage">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
