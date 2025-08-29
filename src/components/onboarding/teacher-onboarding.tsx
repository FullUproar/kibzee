"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const instruments = [
  "Piano", "Guitar", "Violin", "Drums", "Voice", "Bass",
  "Saxophone", "Trumpet", "Flute", "Cello", "Ukulele", "Clarinet"
]

const teachingStyles = [
  "Classical", "Jazz", "Rock", "Pop", "Folk", "Blues", 
  "Country", "Electronic", "Music Theory", "Composition"
]

const ageGroups = ["Children (5-12)", "Teens (13-17)", "Adults (18+)", "Seniors (65+)"]

export default function TeacherOnboarding({ userId }: { userId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    bio: "",
    yearsExperience: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    instrumentsTaught: [] as string[],
    teachingStyles: [] as string[],
    ageGroups: [] as string[],
    languages: ["English"],
    lessonDurations: [30, 45, 60],
    trialLessonRate: "",
    hourlyRate: "",
  })

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].includes(value)
        ? (prev as any)[field].filter((v: string) => v !== value)
        : [...(prev as any)[field], value]
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/onboarding/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
          yearsExperience: parseInt(formData.yearsExperience),
          trialLessonRate: formData.trialLessonRate ? parseInt(formData.trialLessonRate) * 100 : null,
          weeklySchedule: {}, // Empty for now, will be set in settings
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
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                s <= step ? "bg-sage" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {step} of 4
        </p>
      </div>

      {/* Step 1: Teaching Details */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-2">What do you teach?</h2>
            <p className="text-sm text-gray-600 mb-4">Select all instruments you teach</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {instruments.map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => handleArrayToggle("instrumentsTaught", instrument)}
                  className={`p-3 border rounded-subtle transition-all ${
                    formData.instrumentsTaught.includes(instrument)
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
            <label className="block text-sm font-medium mb-2">Years of Teaching Experience</label>
            <input
              type="number"
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
              className="input"
              min="0"
              placeholder="e.g., 5"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={formData.instrumentsTaught.length === 0 || !formData.yearsExperience}
            className="btn btn-primary w-full"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Teaching Style */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-4">Teaching Style & Students</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Teaching Styles</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {teachingStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => handleArrayToggle("teachingStyles", style)}
                    className={`p-2 text-sm border rounded-subtle transition-all ${
                      formData.teachingStyles.includes(style)
                        ? "border-sage bg-sage/10 text-sage"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age Groups You Teach</label>
              <div className="grid grid-cols-2 gap-3">
                {ageGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleArrayToggle("ageGroups", group)}
                    className={`p-3 border rounded-subtle transition-all ${
                      formData.ageGroups.includes(group)
                        ? "border-sage bg-sage/10 text-sage"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {group}
                  </button>
                ))}
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
              disabled={formData.teachingStyles.length === 0 || formData.ageGroups.length === 0}
              className="btn btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-4">Teaching Location</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input"
                    placeholder="San Francisco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input"
                    placeholder="CA"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="input"
                    placeholder="94102"
                  />
                </div>
              </div>
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
              onClick={() => setStep(4)}
              disabled={!formData.city || !formData.state || !formData.zipCode}
              className="btn btn-primary flex-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Bio & Rates */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-serif mb-4">About You & Pricing</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Professional Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input min-h-[150px]"
                placeholder="Tell students about your teaching philosophy, experience, and what makes your lessons special..."
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/2000 characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Trial Lesson Rate (per hour)
                </label>
                <input
                  type="number"
                  value={formData.trialLessonRate}
                  onChange={(e) => setFormData({ ...formData, trialLessonRate: e.target.value })}
                  className="input"
                  placeholder="$ (optional)"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Regular Hourly Rate
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="input"
                  placeholder="$ (you can add more rates later)"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-gold/10 p-4 rounded-subtle">
            <p className="text-sm">
              <strong>Note:</strong> Your profile will need to be verified before you can start teaching. 
              This includes identity verification and background check.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.bio}
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