"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react"

interface PreferenceWizardProps {
  initialPreferences?: {
    categories: Record<string, number>
    genres: string[]
    preferredDays: string[]
    preferredTimes: string[]
    priceMax: number | null
    includeFreeEvents: boolean
    homeCity: string | null
    notifyNewEvents: boolean
    notifyMatches: boolean
    notifyWeekly: boolean
    emailDigest: string
  }
  onComplete?: () => void
}

const CATEGORIES = [
  { value: "CONCERT", label: "Concerts", emoji: "🎵", description: "Live music performances" },
  { value: "THEATER", label: "Theater", emoji: "🎭", description: "Plays and dramatic performances" },
  { value: "MUSICAL", label: "Musicals", emoji: "🎤", description: "Musical theater productions" },
  { value: "GALLERY_OPENING", label: "Gallery", emoji: "🖼️", description: "Art exhibitions and openings" },
  { value: "POETRY_READING", label: "Poetry", emoji: "📝", description: "Poetry readings and slams" },
  { value: "DANCE", label: "Dance", emoji: "💃", description: "Dance performances" },
  { value: "FILM", label: "Film", emoji: "🎬", description: "Film screenings and festivals" },
  { value: "LITERARY", label: "Literary", emoji: "📚", description: "Book readings and literary events" },
]

const GENRES = [
  // Music
  "Jazz", "Classical", "Indie Rock", "Folk", "Blues", "R&B/Soul", "Hip Hop", "Electronic",
  // Theater/Performance
  "Comedy", "Drama", "Improv", "Experimental", "Family-Friendly",
  // Visual Art
  "Contemporary Art", "Photography", "Sculpture", "Mixed Media",
  // Other
  "Local Artists", "Emerging Artists",
]

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
]

const TIMES = [
  { value: "afternoon", label: "Afternoon", description: "12pm - 5pm" },
  { value: "evening", label: "Evening", description: "5pm - 9pm" },
  { value: "late_night", label: "Late Night", description: "9pm+" },
]

const CITIES = [
  "South Bend",
  "Mishawaka",
  "Niles",
  "Buchanan",
  "Elkhart",
  "Granger",
  "Other",
]

export default function PreferenceWizard({ initialPreferences, onComplete }: PreferenceWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const totalSteps = 5

  const [categories, setCategories] = useState<Record<string, number>>(
    initialPreferences?.categories || {}
  )
  const [genres, setGenres] = useState<string[]>(
    initialPreferences?.genres || []
  )
  const [preferredDays, setPreferredDays] = useState<string[]>(
    initialPreferences?.preferredDays || []
  )
  const [preferredTimes, setPreferredTimes] = useState<string[]>(
    initialPreferences?.preferredTimes || []
  )
  const [priceMax, setPriceMax] = useState<number | null>(
    initialPreferences?.priceMax || null
  )
  const [includeFreeEvents, setIncludeFreeEvents] = useState(
    initialPreferences?.includeFreeEvents ?? true
  )
  const [homeCity, setHomeCity] = useState<string>(
    initialPreferences?.homeCity || ""
  )
  const [notifyNewEvents, setNotifyNewEvents] = useState(
    initialPreferences?.notifyNewEvents ?? true
  )
  const [notifyMatches, setNotifyMatches] = useState(
    initialPreferences?.notifyMatches ?? true
  )
  const [notifyWeekly, setNotifyWeekly] = useState(
    initialPreferences?.notifyWeekly ?? true
  )
  const [emailDigest, setEmailDigest] = useState(
    initialPreferences?.emailDigest || "weekly"
  )

  const toggleCategory = (category: string) => {
    setCategories((prev) => {
      const current = prev[category] || 0
      if (current === 0) {
        return { ...prev, [category]: 5 }
      }
      const { [category]: removed, ...rest } = prev
      return rest
    })
  }

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    )
  }

  const toggleTime = (time: string) => {
    setPreferredTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories,
          genres,
          preferredDays,
          preferredTimes,
          priceMax,
          includeFreeEvents,
          homeCity: homeCity || null,
          notifyNewEvents,
          notifyMatches,
          notifyWeekly,
          emailDigest,
        }),
      })

      if (response.ok) {
        if (onComplete) {
          onComplete()
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      console.error("Failed to save preferences:", error)
    } finally {
      setSaving(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return Object.keys(categories).length > 0
      case 2:
        return true // Genres are optional
      case 3:
        return true // Schedule is optional
      case 4:
        return true // Budget is optional
      case 5:
        return true // Notifications are optional
      default:
        return true
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% complete</span>
        </div>
        <div className="h-2 bg-dust rounded-full overflow-hidden">
          <div
            className="h-full bg-sage transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Categories */}
      {step === 1 && (
        <div className="animate-in">
          <h2 className="text-2xl font-serif text-ink mb-2">
            What kind of events interest you?
          </h2>
          <p className="text-gray-600 mb-6">
            Select all that apply. You can always change these later.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  categories[cat.value]
                    ? "border-sage bg-sage/10"
                    : "border-dust hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <p className="font-medium text-ink">{cat.label}</p>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                  {categories[cat.value] && (
                    <Check className="w-5 h-5 text-sage ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Genres */}
      {step === 2 && (
        <div className="animate-in">
          <h2 className="text-2xl font-serif text-ink mb-2">
            Any specific genres or styles?
          </h2>
          <p className="text-gray-600 mb-6">
            Help us personalize your recommendations (optional).
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  genres.includes(genre)
                    ? "border-sage bg-sage/10 text-sage"
                    : "border-dust hover:border-gray-300 text-gray-600"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Schedule */}
      {step === 3 && (
        <div className="animate-in">
          <h2 className="text-2xl font-serif text-ink mb-2">
            When do you usually go out?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ll prioritize events on your preferred days and times.
          </p>

          <div className="space-y-6">
            <div>
              <p className="font-medium text-ink mb-3">Preferred Days</p>
              <div className="flex gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`w-12 h-12 rounded-full border-2 font-medium transition-all ${
                      preferredDays.includes(day.value)
                        ? "border-sage bg-sage text-white"
                        : "border-dust hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-ink mb-3">Preferred Times</p>
              <div className="flex gap-3">
                {TIMES.map((time) => (
                  <button
                    key={time.value}
                    onClick={() => toggleTime(time.value)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      preferredTimes.includes(time.value)
                        ? "border-sage bg-sage/10"
                        : "border-dust hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-ink">{time.label}</p>
                    <p className="text-sm text-gray-500">{time.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-ink mb-3">Your City</p>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full p-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage"
              >
                <option value="">Select your city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Budget */}
      {step === 4 && (
        <div className="animate-in">
          <h2 className="text-2xl font-serif text-ink mb-2">
            What&apos;s your budget?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;ll filter events to match your price range.
          </p>

          <div className="space-y-6">
            <div>
              <p className="font-medium text-ink mb-3">Maximum Ticket Price</p>
              <div className="flex gap-3">
                {[null, 2500, 5000, 10000].map((price) => (
                  <button
                    key={price ?? "any"}
                    onClick={() => setPriceMax(price)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      priceMax === price
                        ? "border-sage bg-sage/10"
                        : "border-dust hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-ink">
                      {price === null ? "Any" : `$${price / 100}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 p-4 rounded-lg border border-dust cursor-pointer hover:bg-dust/50">
              <input
                type="checkbox"
                checked={includeFreeEvents}
                onChange={(e) => setIncludeFreeEvents(e.target.checked)}
                className="w-5 h-5 rounded text-sage focus:ring-sage"
              />
              <div>
                <p className="font-medium text-ink">Include free events</p>
                <p className="text-sm text-gray-500">
                  Show free events in your recommendations
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 5: Notifications */}
      {step === 5 && (
        <div className="animate-in">
          <h2 className="text-2xl font-serif text-ink mb-2">
            Stay in the loop
          </h2>
          <p className="text-gray-600 mb-6">
            How would you like to hear about new events?
          </p>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg border border-dust cursor-pointer hover:bg-dust/50">
              <div>
                <p className="font-medium text-ink">New event alerts</p>
                <p className="text-sm text-gray-500">
                  Get notified when new events match your interests
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyNewEvents}
                onChange={(e) => setNotifyNewEvents(e.target.checked)}
                className="w-5 h-5 rounded text-sage focus:ring-sage"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-dust cursor-pointer hover:bg-dust/50">
              <div>
                <p className="font-medium text-ink">High-match events</p>
                <p className="text-sm text-gray-500">
                  Special alerts for events that are a great fit
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyMatches}
                onChange={(e) => setNotifyMatches(e.target.checked)}
                className="w-5 h-5 rounded text-sage focus:ring-sage"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-dust cursor-pointer hover:bg-dust/50">
              <div>
                <p className="font-medium text-ink">Weekly digest</p>
                <p className="text-sm text-gray-500">
                  A curated roundup of upcoming events
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifyWeekly}
                onChange={(e) => setNotifyWeekly(e.target.checked)}
                className="w-5 h-5 rounded text-sage focus:ring-sage"
              />
            </label>

            <div className="pt-4">
              <p className="font-medium text-ink mb-3">Email Frequency</p>
              <select
                value={emailDigest}
                onChange={(e) => setEmailDigest(e.target.value)}
                className="w-full p-3 border border-dust rounded-lg focus:border-sage focus:ring-1 focus:ring-sage"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="none">No emails</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-dust">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn btn-primary flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Complete Setup
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
