import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import EventCard from "@/components/events/event-card"
import CuratedPicks from "@/components/events/curated-picks"

export default async function HomePage() {
  const session = await auth()

  // Fetch featured events
  const featuredEvents = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { gte: new Date() },
      featured: true,
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
    orderBy: [{ featuredOrder: "asc" }, { startDate: "asc" }],
    take: 3,
  })

  // Fetch curated picks
  const curatedPicks = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { gte: new Date() },
      isCuratedPick: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      category: true,
      startDate: true,
      imageUrl: true,
      curatorNotes: true,
      venue: {
        select: {
          name: true,
          city: true,
        },
      },
      curator: {
        select: {
          name: true,
          curatorProfile: { select: { displayName: true } },
        },
      },
    },
    orderBy: { startDate: "asc" },
    take: 3,
  })

  // Fetch upcoming events (non-featured)
  const upcomingEvents = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { gte: new Date() },
      featured: false,
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
  })

  return (
    <>
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-paper/90 backdrop-blur-md z-50 border-b border-dust">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-serif text-ink">
              kibzee<span className="text-clay ml-1">•</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/events" className="text-ink hover:text-sage transition-colors">
                Events
              </Link>
              <Link href="/about" className="text-ink hover:text-sage transition-colors">
                About
              </Link>
              {session ? (
                <Link href="/dashboard" className="btn btn-primary">
                  Dashboard
                </Link>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              {session ? (
                <Link href="/dashboard" className="btn btn-primary btn-sm">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="btn btn-primary btn-sm">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-in">
              <p className="text-sage font-medium mb-4">Discover Michiana</p>
              <h1 className="text-display-lg font-serif text-ink mb-6">
                Your guide to local arts & culture
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Find concerts, theater, gallery openings, and more. Curated by locals who love the arts.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/events" className="btn btn-primary">
                  Browse Events
                </Link>
                <Link href="/concierge" className="btn btn-secondary">
                  Ask the Concierge
                </Link>
              </div>
            </div>

            <div className="relative h-[400px]">
              {/* Abstract shapes animation */}
              <div className="absolute w-72 h-72 bg-sage/30 rounded-full blur-3xl animate-drift top-10 left-10"></div>
              <div className="absolute w-64 h-64 bg-clay/30 rounded-full blur-3xl animate-drift animation-delay-2000 top-40 right-10"></div>
              <div className="absolute w-52 h-52 bg-gold/30 rounded-full blur-3xl animate-drift animation-delay-4000 bottom-10 left-32"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl text-ink/20">🎭</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-dust">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-display-sm font-serif">Featured Events</h2>
              <Link
                href="/events"
                className="text-sage hover:text-sage/80 font-medium"
              >
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showCuratorNote={event.isCuratedPick}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-display-sm font-serif text-center mb-12">
            What are you in the mood for?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link
              href="/events?category=CONCERT"
              className="card p-6 text-center hover:-translate-y-1 transition-transform"
            >
              <span className="text-4xl mb-3 block">🎵</span>
              <span className="font-medium">Concerts</span>
            </Link>

            <Link
              href="/events?category=THEATER"
              className="card p-6 text-center hover:-translate-y-1 transition-transform"
            >
              <span className="text-4xl mb-3 block">🎭</span>
              <span className="font-medium">Theater</span>
            </Link>

            <Link
              href="/events?category=GALLERY_OPENING"
              className="card p-6 text-center hover:-translate-y-1 transition-transform"
            >
              <span className="text-4xl mb-3 block">🖼️</span>
              <span className="font-medium">Gallery</span>
            </Link>

            <Link
              href="/events?category=POETRY_READING"
              className="card p-6 text-center hover:-translate-y-1 transition-transform"
            >
              <span className="text-4xl mb-3 block">📝</span>
              <span className="font-medium">Poetry</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Picks Section */}
      <CuratedPicks events={curatedPicks.map(e => ({
        ...e,
        startDate: e.startDate.toISOString(),
      }))} />

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-display-sm font-serif">Coming Up</h2>
              <Link
                href="/events"
                className="text-sage hover:text-sage/80 font-medium"
              >
                See all events →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-display-md font-serif text-center mb-16">
              How it works
            </h2>

            <div className="space-y-8">
              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">1</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Discover</h3>
                  <p className="text-gray-600">
                    Browse our curated calendar of events, or chat with our AI concierge to find something perfect for you.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">2</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Save</h3>
                  <p className="text-gray-600">
                    Save events you&apos;re interested in. Set your preferences to get notified about new events you&apos;ll love.
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start group">
                <span className="text-5xl font-serif italic text-sage">3</span>
                <div className="flex-1 pb-8 border-b border-dust group-hover:border-sage transition-colors">
                  <h3 className="text-xl font-serif mb-2">Go</h3>
                  <p className="text-gray-600">
                    Show up and enjoy! Support local artists and venues in the Michiana community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge CTA */}
      <section className="py-24 bg-ink text-paper">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-6xl mb-6 block">💬</span>
            <h2 className="text-display-md font-serif mb-6">
              Not sure what to do this weekend?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Chat with our AI concierge. Tell us what you&apos;re in the mood for, and we&apos;ll find the perfect event.
            </p>
            <Link href="/concierge" className="btn bg-paper text-ink hover:bg-dust">
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-display-sm font-serif mb-6">
              Built by locals, for locals
            </h2>
            <p className="text-gray-600 mb-8">
              Kibzee is curated by people who live here and love the Michiana arts scene.
              We&apos;re not just aggregating events — we&apos;re highlighting what&apos;s actually worth your time.
            </p>
            <p className="text-sage font-medium">
              South Bend • Mishawaka • Niles • Buchanan
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-dust">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-serif mb-4">kibzee</h3>
              <p className="text-gray-600">
                Discover the best of Michiana arts and culture.
                Curated with love by your neighbors.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-sage mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="text-gray-600 hover:text-clay transition-colors">
                    All Events
                  </Link>
                </li>
                <li>
                  <Link href="/venues" className="text-gray-600 hover:text-clay transition-colors">
                    Venues
                  </Link>
                </li>
                <li>
                  <Link href="/artists" className="text-gray-600 hover:text-clay transition-colors">
                    Artists
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sage mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-clay transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-clay transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-dust text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
