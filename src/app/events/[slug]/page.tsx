import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ExternalLink,
  Share2,
  Bookmark,
  Star,
  ArrowLeft,
  Music2,
  User,
} from "lucide-react"
import { Metadata } from "next"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    select: { title: true, shortDescription: true, imageUrl: true },
  })

  if (!event) {
    return { title: "Event Not Found" }
  }

  return {
    title: `${event.title} | Kibzee`,
    description: event.shortDescription || `Find details about ${event.title} on Kibzee`,
    openGraph: {
      title: event.title,
      description: event.shortDescription || undefined,
      images: event.imageUrl ? [event.imageUrl] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      venue: true,
      curator: {
        select: {
          id: true,
          name: true,
          image: true,
          curatorProfile: {
            select: {
              displayName: true,
              bio: true,
              expertise: true,
            },
          },
        },
      },
      artists: {
        include: {
          artist: true,
        },
        orderBy: { order: "asc" },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!event) {
    notFound()
  }

  const startDate = new Date(event.startDate)
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  const doorTime = event.doorTime
    ? new Date(event.doorTime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null

  const formatPrice = () => {
    if (event.isFree) return "Free"
    if (!event.priceMin) return "Price TBD"
    if (event.priceMin === event.priceMax || !event.priceMax) {
      return `$${(event.priceMin / 100).toFixed(0)}`
    }
    return `$${(event.priceMin / 100).toFixed(0)} - $${(event.priceMax / 100).toFixed(0)}`
  }

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

  const curatorName =
    event.curator?.curatorProfile?.displayName || event.curator?.name

  const headliner = event.artists.find((a) => a.role === "headliner")?.artist
  const otherArtists = event.artists.filter((a) => a.role !== "headliner")

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
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-sage/30 to-clay/30 h-64 md:h-96">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-ink">
                  {categoryLabels[event.category] || event.category}
                </span>
                {event.isCuratedPick && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-clay text-white rounded-full text-sm font-medium">
                    <Star className="w-3 h-3 fill-current" />
                    Curated Pick
                  </span>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-display-sm font-serif text-ink mb-4">
                {event.title}
              </h1>

              {headliner && (
                <p className="text-xl text-gray-600 mb-4">
                  Featuring {headliner.name}
                </p>
              )}

              <div className="prose prose-gray max-w-none">
                <p>{event.description}</p>
              </div>
            </div>

            {/* Artists */}
            {event.artists.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-serif text-ink mb-4 flex items-center gap-2">
                  <Music2 className="w-5 h-5 text-sage" />
                  Artists
                </h2>
                <div className="space-y-4">
                  {event.artists.map(({ artist, role }) => (
                    <div key={artist.id} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                        {artist.imageUrl ? (
                          <img
                            src={artist.imageUrl}
                            alt={artist.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-sage" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-ink">{artist.name}</h3>
                        <p className="text-sm text-gray-500">
                          {role && <span className="capitalize">{role}</span>}
                          {role && artist.primaryGenre && " • "}
                          {artist.primaryGenre}
                        </p>
                        {artist.bio && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {artist.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curated Pick Banner */}
            {event.isCuratedPick && (
              <div className="relative overflow-hidden card p-6 bg-gradient-to-br from-clay/10 to-gold/10 border-clay/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-clay/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-clay fill-clay" />
                    <span className="text-sm font-medium text-clay uppercase tracking-wide">
                      Curated Pick
                    </span>
                  </div>
                  <p className="text-ink font-serif text-lg">
                    One of our curators has hand-selected this event as a must-see experience in Michiana.
                  </p>
                </div>
              </div>
            )}

            {/* Curator's Take */}
            {event.curatorNotes && curatorName && (
              <div className="card p-6 bg-clay/5 border-clay/20">
                <h2 className="text-xl font-serif text-ink mb-4">
                  Curator's Take
                </h2>
                <blockquote className="text-gray-700 italic mb-4">
                  "{event.curatorNotes}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-clay/20 flex items-center justify-center">
                    {event.curator?.image ? (
                      <img
                        src={event.curator.image}
                        alt={curatorName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-clay" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{curatorName}</p>
                    <p className="text-sm text-gray-500">Kibzee Curator</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-dust rounded-full text-sm text-gray-600"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Event Details Card */}
              <div className="card p-6">
                <div className="space-y-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-sage mt-0.5" />
                    <div>
                      <p className="font-medium text-ink">{formattedDate}</p>
                      <p className="text-gray-600">{formattedTime}</p>
                      {doorTime && (
                        <p className="text-sm text-gray-500">
                          Doors open at {doorTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-clay mt-0.5" />
                    <div>
                      <Link
                        href={`/venues/${event.venue.slug}`}
                        className="font-medium text-ink hover:text-sage transition-colors"
                      >
                        {event.venue.name}
                      </Link>
                      <p className="text-gray-600">{event.venue.address}</p>
                      <p className="text-gray-600">
                        {event.venue.city}, {event.venue.state} {event.venue.zipCode}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-gold mt-0.5" />
                    <div>
                      <p className="font-medium text-ink">{formatPrice()}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-6 space-y-3">
                  {event.ticketUrl ? (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <span>Get Tickets</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <button className="btn btn-primary w-full">
                      Save Event
                    </button>
                  )}

                  <div className="flex gap-3">
                    <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Venue Card */}
              <div className="card p-6">
                <h3 className="font-serif text-lg text-ink mb-3">About the Venue</h3>
                <Link
                  href={`/venues/${event.venue.slug}`}
                  className="font-medium text-sage hover:text-sage/80 transition-colors"
                >
                  {event.venue.name}
                </Link>
                {event.venue.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {event.venue.description}
                  </p>
                )}
                {event.venue.website && (
                  <a
                    href={event.venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sage hover:underline mt-2 inline-flex items-center gap-1"
                  >
                    Visit website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
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
