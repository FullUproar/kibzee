import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Users,
  ArrowLeft,
  Calendar,
  Accessibility,
  Car,
} from "lucide-react"
import { Metadata } from "next"
import EventCard from "@/components/events/event-card"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const venue = await prisma.venue.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, imageUrl: true },
  })

  if (!venue) {
    return { title: "Venue Not Found" }
  }

  return {
    title: `${venue.name} | Kibzee`,
    description: venue.description || `Find events at ${venue.name} on Kibzee`,
    openGraph: {
      title: venue.name,
      description: venue.description || undefined,
      images: venue.imageUrl ? [venue.imageUrl] : undefined,
    },
  }
}

export default async function VenueDetailPage({ params }: PageProps) {
  const venue = await prisma.venue.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        where: {
          status: "PUBLISHED",
          startDate: { gte: new Date() },
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
        orderBy: { startDate: "asc" },
        take: 6,
      },
    },
  })

  if (!venue) {
    notFound()
  }

  const accessibility = venue.accessibility as Record<string, boolean> | null

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-white border-b border-dust">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-sage/30 to-clay/30 h-64 md:h-80">
              {venue.imageUrl && (
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              )}
              {venue.venueType && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-ink capitalize">
                    {venue.venueType}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-display-sm font-serif text-ink mb-2">
                {venue.name}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {venue.city}, {venue.state}
              </p>
              {venue.description && (
                <div className="mt-4 prose prose-gray max-w-none">
                  <p>{venue.description}</p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            {venue.events.length > 0 && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sage" />
                  Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {venue.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Venue Info Card */}
              <div className="card p-6">
                <h3 className="font-serif text-lg text-ink mb-4">
                  Venue Details
                </h3>
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-clay mt-0.5" />
                    <div>
                      <p className="font-medium text-ink">{venue.address}</p>
                      <p className="text-gray-600">
                        {venue.city}, {venue.state} {venue.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Capacity */}
                  {venue.capacity && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-sage mt-0.5" />
                      <div>
                        <p className="text-gray-600">
                          Capacity: {venue.capacity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {venue.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <a
                        href={`tel:${venue.phone}`}
                        className="text-sage hover:underline"
                      >
                        {venue.phone}
                      </a>
                    </div>
                  )}

                  {/* Email */}
                  {venue.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <a
                        href={`mailto:${venue.email}`}
                        className="text-sage hover:underline"
                      >
                        {venue.email}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {venue.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sage hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessibility */}
              {accessibility && Object.keys(accessibility).length > 0 && (
                <div className="card p-6">
                  <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-sage" />
                    Accessibility
                  </h3>
                  <div className="space-y-2">
                    {accessibility.wheelchair && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Wheelchair accessible
                      </p>
                    )}
                    {accessibility.hearing_loop && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Hearing loop available
                      </p>
                    )}
                    {accessibility.elevator && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        Elevator access
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Parking */}
              {venue.parking && (
                <div className="card p-6">
                  <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-sage" />
                    Parking
                  </h3>
                  <p className="text-gray-600">{venue.parking}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

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
