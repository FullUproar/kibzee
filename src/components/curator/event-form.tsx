"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Calendar, MapPin, DollarSign, Link as LinkIcon } from "lucide-react"

interface Venue {
  id: string
  name: string
  city: string
}

interface EventFormProps {
  venues: Venue[]
  onSuccess?: () => void
}

const CATEGORIES = [
  { value: "CONCERT", label: "Concert" },
  { value: "THEATER", label: "Theater" },
  { value: "MUSICAL", label: "Musical" },
  { value: "GALLERY_OPENING", label: "Gallery Opening" },
  { value: "POETRY_READING", label: "Poetry Reading" },
  { value: "DANCE", label: "Dance" },
  { value: "FILM", label: "Film" },
  { value: "LITERARY", label: "Literary" },
]

export default function EventForm({ venues, onSuccess }: EventFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [category, setCategory] = useState("")
  const [venueId, setVenueId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [doorTime, setDoorTime] = useState("")
  const [isFree, setIsFree] = useState(false)
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [ticketUrl, setTicketUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [curatorNotes, setCuratorNotes] = useState("")
  const [isCuratedPick, setIsCuratedPick] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!title || !description || !category || !startDate || !startTime || !venueId) {
      setError("Please fill in all required fields")
      return
    }

    setSubmitting(true)

    try {
      // Combine date and time
      const startDateTime = new Date(`${startDate}T${startTime}`)
      const doorDateTime = doorTime ? new Date(`${startDate}T${doorTime}`) : null

      const response = await fetch("/api/curator/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          shortDescription: shortDescription || null,
          category,
          venueId,
          startDate: startDateTime.toISOString(),
          doorTime: doorDateTime?.toISOString() || null,
          isFree,
          priceMin: isFree ? null : (priceMin ? parseFloat(priceMin) : null),
          priceMax: isFree ? null : (priceMax ? parseFloat(priceMax) : null),
          ticketUrl: ticketUrl || null,
          imageUrl: imageUrl || null,
          curatorNotes: curatorNotes || null,
          isCuratedPick,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setTitle("")
        setDescription("")
        setShortDescription("")
        setCategory("")
        setVenueId("")
        setStartDate("")
        setStartTime("")
        setDoorTime("")
        setIsFree(false)
        setPriceMin("")
        setPriceMax("")
        setTicketUrl("")
        setImageUrl("")
        setCuratorNotes("")
        setIsCuratedPick(false)

        if (onSuccess) {
          onSuccess()
        } else {
          // Redirect to dashboard after delay
          setTimeout(() => {
            router.push("/curator")
          }, 2000)
        }
      } else {
        const data = await response.json()
        setError(data.error || "Failed to submit event")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Event submitted successfully! It will be reviewed before publishing.
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-ink border-b border-dust pb-2">
          Basic Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Jazz Night at Merrimans'"
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Short Description
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A brief tagline for event cards (optional)"
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Full Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell people about this event..."
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none resize-none"
            rows={5}
          />
        </div>
      </div>

      {/* Date & Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-ink border-b border-dust pb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sage" />
          Date & Location
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Date *
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Start Time *
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Door Time (optional)
          </label>
          <input
            type="time"
            value={doorTime}
            onChange={(e) => setDoorTime(e.target.value)}
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-clay" />
            Venue *
          </label>
          <select
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          >
            <option value="">Select a venue</option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} - {venue.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-ink border-b border-dust pb-2 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gold" />
          Pricing
        </h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            className="w-5 h-5 rounded text-sage focus:ring-sage"
          />
          <span className="text-ink">This is a free event</span>
        </label>

        {!isFree && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-ink mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Ticket URL
          </label>
          <input
            type="url"
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          />
        </div>
      </div>

      {/* Media & Curation */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif text-ink border-b border-dust pb-2">
          Media & Curation
        </h3>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Link to an image for this event
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Your Take (Curator Notes)
          </label>
          <textarea
            value={curatorNotes}
            onChange={(e) => setCuratorNotes(e.target.value)}
            placeholder="Why should people check this out? What makes it special?"
            className="w-full px-4 py-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage outline-none resize-none"
            rows={3}
            maxLength={300}
          />
          <p className="text-xs text-gray-500 mt-1">
            {curatorNotes.length}/300 characters
          </p>
        </div>

        <label className="flex items-center gap-3 cursor-pointer p-4 border border-dust rounded-lg hover:bg-dust/50">
          <input
            type="checkbox"
            checked={isCuratedPick}
            onChange={(e) => setIsCuratedPick(e.target.checked)}
            className="w-5 h-5 rounded text-clay focus:ring-clay"
          />
          <div>
            <span className="text-ink font-medium">Mark as Curated Pick</span>
            <p className="text-sm text-gray-500">
              Highlight this as a must-see event you personally recommend
            </p>
          </div>
        </label>
      </div>

      {/* Submit */}
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
            "Submit Event"
          )}
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Your event will be reviewed before being published
        </p>
      </div>
    </form>
  )
}
