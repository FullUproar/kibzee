"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, Loader2, Check, Clock, X } from "lucide-react"

const EXPERTISE_OPTIONS = [
  "Jazz",
  "Classical Music",
  "Rock/Indie",
  "Folk/Americana",
  "Theater",
  "Musical Theater",
  "Dance",
  "Visual Art",
  "Photography",
  "Poetry/Spoken Word",
  "Film",
  "Comedy",
  "Local Bands",
  "Emerging Artists",
]

type CuratorStatus = "PENDING" | "APPROVED" | "SUSPENDED" | "REVOKED" | null

export default function CuratorApplyPage() {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existingStatus, setExistingStatus] = useState<CuratorStatus>(null)

  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [expertise, setExpertise] = useState<string[]>([])
  const [website, setWebsite] = useState("")
  const [instagram, setInstagram] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login?callbackUrl=/curator/apply")
      return
    }

    if (sessionStatus === "authenticated") {
      checkExistingApplication()
    }
  }, [sessionStatus, router])

  const checkExistingApplication = async () => {
    try {
      const response = await fetch("/api/curator/apply")
      const data = await response.json()

      if (data?.status) {
        setExistingStatus(data.status)
      }
    } catch (err) {
      console.error("Failed to check application status:", err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpertise = (item: string) => {
    setExpertise((prev) =>
      prev.includes(item)
        ? prev.filter((e) => e !== item)
        : [...prev, item]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!displayName.trim()) {
      setError("Please enter a display name")
      return
    }

    if (expertise.length === 0) {
      setError("Please select at least one area of expertise")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch("/api/curator/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          bio: bio.trim() || null,
          expertise,
          website: website.trim() || null,
          instagram: instagram.trim() || null,
        }),
      })

      if (response.ok) {
        setExistingStatus("PENDING")
      } else {
        const data = await response.json()
        setError(data.error || "Something went wrong")
      }
    } catch {
      setError("Failed to submit application")
    } finally {
      setSubmitting(false)
    }
  }

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    )
  }

  // Show status if already applied
  if (existingStatus) {
    return (
      <div className="min-h-screen bg-paper">
        <header className="bg-white border-b border-dust">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-lg mx-auto text-center">
            {existingStatus === "PENDING" && (
              <>
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-gold" />
                </div>
                <h1 className="text-2xl font-serif text-ink mb-4">
                  Application Under Review
                </h1>
                <p className="text-gray-600 mb-8">
                  Thanks for applying to become a Kibzee curator! We&apos;re reviewing
                  your application and will get back to you soon.
                </p>
              </>
            )}

            {existingStatus === "APPROVED" && (
              <>
                <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-sage" />
                </div>
                <h1 className="text-2xl font-serif text-ink mb-4">
                  You&apos;re a Curator!
                </h1>
                <p className="text-gray-600 mb-8">
                  Your application has been approved. You can now submit events
                  to the Kibzee calendar.
                </p>
                <Link href="/curator" className="btn btn-primary">
                  Go to Curator Dashboard
                </Link>
              </>
            )}

            {(existingStatus === "SUSPENDED" || existingStatus === "REVOKED") && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-serif text-ink mb-4">
                  Application Status: {existingStatus}
                </h1>
                <p className="text-gray-600 mb-8">
                  Your curator status has been {existingStatus.toLowerCase()}. Please
                  contact us if you have questions.
                </p>
              </>
            )}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-white border-b border-dust">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-display-sm font-serif text-ink mb-4">
              Become a Kibzee Curator
            </h1>
            <p className="text-gray-600">
              Help your community discover amazing events. Curators submit events,
              write recommendations, and shape the local arts calendar.
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Display Name *
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How you want to be known on Kibzee"
                  className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will appear on events you curate
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  About You
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your connection to the local arts scene..."
                  className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Areas of Expertise *
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  What types of events do you know best?
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXPERTISE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleExpertise(option)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        expertise.includes(option)
                          ? "border-sage bg-sage/10 text-sage"
                          : "border-dust hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Website (optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Instagram (optional)
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@username"
                    className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Already a curator?{" "}
              <Link href="/curator" className="text-sage hover:underline">
                Go to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
