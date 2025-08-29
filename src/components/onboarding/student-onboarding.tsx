"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const instruments = [
  "Piano", "Guitar", "Violin", "Drums", "Voice", "Bass",
  "Saxophone", "Trumpet", "Flute", "Cello", "Ukulele", "Clarinet"
]

const experienceLevels = [
  { value: "BEGINNER", label: "Beginner - Just starting out" },
  { value: "INTERMEDIATE", label: "Intermediate - Some experience" },
  { value: "ADVANCED", label: "Advanced - Looking to refine skills" },
]

export default function StudentOnboarding({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    zipCode: "",
    instrumentsInterest: [] as string[],
    experienceLevel: "BEGINNER",
    preferredFormat: "BOTH",
    budgetMin: "",
    budgetMax: "",
    travelRadius: "10",
    availableDays: [] as string[],
  })

  const handleInstrumentToggle = (instrument: string) => {
    setFormData(prev => ({
      ...prev,
      instrumentsInterest: prev.instrumentsInterest.includes(instrument)
        ? prev.instrumentsInterest.filter(i => i !== instrument)
        : [...prev.instrumentsInterest, instrument]
    }))
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          budgetMin: formData.budgetMin ? parseInt(formData.budgetMin) * 100 : null,
          budgetMax: formData.budgetMax ? parseInt(formData.budgetMax) * 100 : null,
          travelRadius: parseInt(formData.travelRadius),
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                s <= step ? "bg-sage" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {step} of 3
        </p>
      </div>

      {/* Step 1: Interests */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-2">What would you like to learn?</h2>
            <p className="text-sm text-gray-600 mb-4">Select all instruments you're interested in</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {instruments.map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => handleInstrumentToggle(instrument)}
                  className={`p-3 border rounded-subtle transition-all ${
                    formData.instrumentsInterest.includes(instrument)
                      ? "border-sage bg-sage/10 text-sage"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {instrument}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="input"
            >
              {experienceLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Lesson Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "IN_PERSON", label: "In Person" },
                { value: "ONLINE", label: "Online" },
                { value: "BOTH", label: "Both" },
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setFormData({ ...formData, preferredFormat: format.value })}
                  className={`p-3 border rounded-subtle transition-all ${
                    formData.preferredFormat === format.value
                      ? "border-sage bg-sage/10 text-sage"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={formData.instrumentsInterest.length === 0}
            className="btn btn-primary w-full"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Location & Budget */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-4">Location & Budget</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="e.g., San Francisco"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="input"
                  placeholder="e.g., 94102"
                />
              </div>
            </div>

            {formData.preferredFormat !== "ONLINE" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Travel Radius (miles)
                </label>
                <input
                  type="number"
                  value={formData.travelRadius}
                  onChange={(e) => setFormData({ ...formData, travelRadius: e.target.value })}
                  className="input"
                  min="1"
                  max="50"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Budget Range (per hour)</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  value={formData.budgetMin}
                  onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                  className="input"
                  placeholder="Min ($)"
                  min="0"
                />
                <input
                  type="number"
                  value={formData.budgetMax}
                  onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                  className="input"
                  placeholder="Max ($)"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Availability & Bio */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-4">Availability & About You</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Available Days</label>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`p-2 text-sm border rounded-subtle transition-all ${
                      formData.availableDays.includes(day)
                        ? "border-sage bg-sage/10 text-sage"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tell us about yourself (optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input min-h-[100px]"
                placeholder="What are your musical goals? What inspired you to learn music?"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}