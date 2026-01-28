import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SettingsTabs from "@/components/settings/settings-tabs"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      preferences: true,
      curatorProfile: true
    }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-dust">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-ink mb-8">Settings</h1>
        <SettingsTabs user={user} />
      </div>
    </div>
  )
}
