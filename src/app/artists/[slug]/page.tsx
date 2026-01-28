import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  ArrowLeft,
  Globe,
  Instagram,
  Music2,
  MapPin,
  Calendar,
  ExternalLink,
} from "lucide-react"
import { Metadata } from "next"
import EventCard from "@/components/events/event-card"

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    select: { name: true, bio: true, imageUrl: true },
  })

  if (!artist) {
    return { title: "Artist Not Found" }
  }

  return {
    title: `${artist.name} | Kibzee`,
    description: artist.bio || `Find events featuring ${artist.name} on Kibzee`,
    openGraph: {
      title: artist.name,
      description: artist.bio || undefined,
      images: artist.imageUrl ? [artist.imageUrl] : undefined,
    },
  }
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const artist = await prisma.artist.findUnique({
    where: { slug: params.slug },
    include: {
      events: {
        where: {
          event: {
            status: "PUBLISHED",
            startDate: { gte: new Date() },
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
          },
        },
        orderBy: {
          event: { startDate: "asc" },
        },
        take: 6,
      },
    },
  })

  if (!artist) {
    notFound()
  }

  const upcomingEvents = artist.events.map((e) => e.event)

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
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Image */}
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-sage/30 to-clay/30 flex-shrink-0">
                {artist.imageUrl ? (
                  <img
                    src={artist.imageUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music2 className="w-16 h-16 text-sage/50" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  {artist.isLocal && (
                    <span className="px-2 py-1 bg-sage/20 text-sage text-xs font-medium rounded-full">
                      Local Artist
                    </span>
                  )}
                  {artist.artForm && (
                    <span className="px-2 py-1 bg-dust text-gray-600 text-xs font-medium rounded-full capitalize">
                      {artist.artForm}
                    </span>
                  )}
                </div>
                <h1 className="text-display-sm font-serif text-ink mb-2">
                  {artist.name}
                </h1>
                {artist.city && (
                  <p className="text-gray-600 flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4" />
                    {artist.city}
                  </p>
                )}
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {artist.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-dust text-gray-600 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {artist.bio && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-4">About</h2>
                <div className="prose prose-gray max-w-none">
                  <p>{artist.bio}</p>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-serif text-ink mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sage" />
                  Upcoming Events
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Social Links */}
              {(artist.website ||
                artist.instagram ||
                artist.spotify ||
                artist.bandcamp ||
                artist.youtube) && (
                <div className="card p-6">
                  <h3 className="font-serif text-lg text-ink mb-4">
                    Connect
                  </h3>
                  <div className="space-y-3">
                    {artist.website && (
                      <a
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-sage transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                        <span>Website</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {artist.instagram && (
                      <a
                        href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-sage transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                        <span>{artist.instagram}</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {artist.spotify && (
                      <a
                        href={`https://open.spotify.com/artist/${artist.spotify}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-sage transition-colors"
                      >
                        <Music2 className="w-5 h-5" />
                        <span>Spotify</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                    {artist.bandcamp && (
                      <a
                        href={`https://${artist.bandcamp}.bandcamp.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-sage transition-colors"
                      >
                        <Music2 className="w-5 h-5" />
                        <span>Bandcamp</span>
                        <ExternalLink className="w-4 h-4 ml-auto" />
                      </a>
                    )}
                  </div>
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
