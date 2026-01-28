import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import EventForm from "@/components/curator/event-form"

export const metadata = {
  title: "Add Event | Kibzee Curator",
  description: "Submit a new event to the Kibzee calendar",
}

export default async function NewEventPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?callbackUrl=/curator/events/new")
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

  // Get venues for the form
  const venues = await prisma.venue.findMany({
    select: {
      id: true,
      name: true,
      city: true,
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-white border-b border-dust">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/curator"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Curator Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-display-sm font-serif text-ink mb-2">
              Add New Event
            </h1>
            <p className="text-gray-600">
              Submit an event to the Kibzee calendar. It will be reviewed before
              publishing.
            </p>
          </div>

          <div className="card p-8">
            <EventForm venues={venues} />
          </div>
        </div>
      </main>
    </div>
  )
}
