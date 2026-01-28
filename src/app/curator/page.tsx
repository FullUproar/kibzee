import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import {
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  ArrowLeft,
} from "lucide-react"

export const metadata = {
  title: "Curator Dashboard | Kibzee",
  description: "Manage your curated events",
}

export default async function CuratorDashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?callbackUrl=/curator")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { curatorProfile: true },
  })

  if (!user) {
    redirect("/login")
  }

  // Check if user is a curator
  const isAdmin = user.role === "ADMIN"
  const isFounderCurator = user.role === "FOUNDER_CURATOR"
  const isCommunityApproved = user.curatorProfile?.status === "APPROVED"

  if (!isAdmin && !isFounderCurator && !isCommunityApproved) {
    redirect("/curator/apply")
  }

  // Get curator stats
  const [events, stats] = await Promise.all([
    prisma.event.findMany({
      where: { curatorId: session.user.id },
      include: {
        venue: {
          select: { name: true, city: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["status"],
      where: { curatorId: session.user.id },
      _count: true,
    }),
  ])

  const totalEvents = stats.reduce((sum, s) => sum + s._count, 0)
  const publishedCount = stats.find((s) => s.status === "PUBLISHED")?._count || 0
  const pendingCount = stats.find((s) => s.status === "PENDING_REVIEW")?._count || 0
  const curatedPicks = await prisma.event.count({
    where: { curatorId: session.user.id, isCuratedPick: true },
  })

  const curatorName =
    user.curatorProfile?.displayName || user.name || "Curator"

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-white border-b border-dust">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <Link href="/curator/events/new" className="btn btn-primary btn-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-display-sm font-serif text-ink mb-2">
            Welcome, {curatorName}
          </h1>
          <p className="text-gray-600">
            {isFounderCurator
              ? "Founder Curator"
              : isAdmin
                ? "Administrator"
                : "Community Curator"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-sage" />
              <span className="text-sm text-gray-500">Total Events</span>
            </div>
            <p className="text-3xl font-serif text-ink">{totalEvents}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500">Published</span>
            </div>
            <p className="text-3xl font-serif text-ink">{publishedCount}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-gold" />
              <span className="text-sm text-gray-500">Pending Review</span>
            </div>
            <p className="text-3xl font-serif text-ink">{pendingCount}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-clay" />
              <span className="text-sm text-gray-500">Curated Picks</span>
            </div>
            <p className="text-3xl font-serif text-ink">{curatedPicks}</p>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <div className="p-6 border-b border-dust">
            <h2 className="text-xl font-serif text-ink">Your Events</h2>
          </div>

          {events.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-ink mb-2">
                No events yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding events to the Kibzee calendar
              </p>
              <Link href="/curator/events/new" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-dust">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 flex items-center justify-between hover:bg-dust/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-ink truncate">
                        {event.title}
                      </h3>
                      {event.isCuratedPick && (
                        <Star className="w-4 h-4 text-clay fill-clay flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.venue.name} • {" "}
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : event.status === "PENDING_REVIEW"
                            ? "bg-gold/20 text-gold"
                            : event.status === "DRAFT"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.status.replace("_", " ")}
                    </span>
                    <Link
                      href={`/events/${event.slug}`}
                      className="text-sage text-sm hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
