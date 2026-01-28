import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Calendar, Bookmark } from "lucide-react"
import EventCard from "@/components/events/event-card"

export const metadata = {
  title: "Saved Events | Kibzee",
  description: "Your saved events",
}

export default async function SavedEventsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const savedEvents = await prisma.savedEvent.findMany({
    where: {
      userId: session.user.id,
      event: {
        status: "PUBLISHED",
      },
    },
    include: {
      event: {
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              state: true,
              address: true,
            },
          },
          artists: {
            include: { artist: true },
            orderBy: { order: "asc" },
          },
          curator: {
            select: {
              id: true,
              name: true,
              curatorProfile: { select: { displayName: true } },
            },
          },
          tags: {
            include: { tag: true },
          },
        },
      },
    },
    orderBy: {
      event: { startDate: "asc" },
    },
  })

  const now = new Date()
  const upcomingEvents = savedEvents.filter((se) => se.event.startDate >= now)
  const pastEvents = savedEvents.filter((se) => se.event.startDate < now)

  return (
    <div className="min-h-screen bg-paper">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-display-sm font-serif text-ink flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-sage" />
            Saved Events
          </h1>
          <p className="text-gray-600 mt-2">
            {savedEvents.length} {savedEvents.length === 1 ? "event" : "events"} saved
          </p>
        </div>

        {savedEvents.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-ink mb-2">
              No saved events yet
            </h2>
            <p className="text-gray-500 mb-6">
              Browse events and save the ones you&apos;re interested in
            </p>
            <Link href="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-4">
                  Upcoming ({upcomingEvents.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(({ event }) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-4 text-gray-500">
                  Past Events ({pastEvents.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {pastEvents.map(({ event }) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
