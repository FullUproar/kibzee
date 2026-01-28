import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import PreferenceWizard from "@/components/preferences/preference-wizard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Preferences | Kibzee",
  description: "Set your event preferences",
}

export default async function PreferencesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  })

  const initialPreferences = preferences
    ? {
        categories: preferences.categories as Record<string, number>,
        genres: preferences.genres,
        preferredDays: preferences.preferredDays,
        preferredTimes: preferences.preferredTimes,
        priceMax: preferences.priceMax,
        includeFreeEvents: preferences.includeFreeEvents,
        homeCity: preferences.homeCity,
        notifyNewEvents: preferences.notifyNewEvents,
        notifyMatches: preferences.notifyMatches,
        notifyWeekly: preferences.notifyWeekly,
        emailDigest: preferences.emailDigest,
      }
    : undefined

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
          <h1 className="text-display-sm font-serif text-ink">
            Your Preferences
          </h1>
          <p className="text-gray-600 mt-2">
            Help us find events you&apos;ll love
          </p>
        </div>

        <PreferenceWizard initialPreferences={initialPreferences} />
      </div>
    </div>
  )
}
