"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import EventCard from "./event-card"

interface SaveableEventCardProps {
  event: Parameters<typeof EventCard>[0]["event"]
  showCuratorNote?: boolean
  initialSaved?: boolean
}

export default function SaveableEventCard({
  event,
  showCuratorNote = false,
  initialSaved = false,
}: SaveableEventCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [saving, setSaving] = useState(false)

  const handleSave = async (eventId: string) => {
    if (!session) {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (saving) return
    setSaving(true)

    try {
      if (saved) {
        // Unsave
        await fetch(`/api/saved?eventId=${eventId}`, {
          method: "DELETE",
        })
        setSaved(false)
      } else {
        // Save
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        })
        setSaved(true)
      }
    } catch (error) {
      console.error("Failed to save event:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <EventCard
      event={event}
      showCuratorNote={showCuratorNote}
      isSaved={saved}
      onSave={handleSave}
    />
  )
}
