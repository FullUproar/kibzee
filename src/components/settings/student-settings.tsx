"use client"

import { useState } from "react"

interface StudentSettingsProps {
  user: any // TODO: Add proper types
}

export default function StudentSettings({ user }: StudentSettingsProps) {
  const profile = user.studentProfile
  const [preferences, setPreferences] = useState({
    instrumentsInterest: profile?.instrumentsInterest || [],
    experienceLevel: profile?.experienceLevel || "BEGINNER",
    preferredFormat: profile?.preferredFormat || "BOTH",
    budgetMin: profile?.budgetMin ? profile.budgetMin / 100 : "",
    budgetMax: profile?.budgetMax ? profile.budgetMax / 100 : "",
    travelRadius: profile?.travelRadius || 10,
    location: profile?.location || "",
    zipCode: profile?.zipCode || "",
    bio: profile?.bio || "",
  })

  const instruments = [
    "Piano", "Guitar", "Violin", "Drums", "Voice", "Bass",
    "Saxophone", "Trumpet", "Flute", "Cello", "Ukulele", "Clarinet"
  ]

  const handleSave = async () => {
    // TODO: Implement API call
    console.log("Saving student preferences:", preferences)
  }

  return (
    <div className="space-y-6">
      {/* Learning Preferences */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Learning Preferences</h2>
        
        <div className="space-y-6">
          {/* Instruments */}
          <div>
            <label className="block text-sm font-medium mb-2">Instruments of Interest</label>
            <div className="grid grid-cols-3 gap-3">
              {instruments.map(instrument => (
                <label key={instrument} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.instrumentsInterest.includes(instrument)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences({
                          ...preferences,
                          instrumentsInterest: [...preferences.instrumentsInterest, instrument]
                        })
                      } else {
                        setPreferences({
                          ...preferences,
                          instrumentsInterest: preferences.instrumentsInterest.filter((i: string) => i !== instrument)
                        })
                      }
                    }}
                  />
                  <span className="text-sm">{instrument}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <select
              value={preferences.experienceLevel}
              onChange={(e) => setPreferences({ ...preferences, experienceLevel: e.target.value })}
              className="input"
            >
              <option value="BEGINNER">Beginner - Just starting out</option>
              <option value="INTERMEDIATE">Intermediate - Some experience</option>
              <option value="ADVANCED">Advanced - Looking to refine skills</option>
            </select>
          </div>

          {/* Lesson Format */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Lesson Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "IN_PERSON", label: "In Person" },
                { value: "ONLINE", label: "Online" },
                { value: "BOTH", label: "Both" }
              ].map(format => (
                <button
                  key={format.value}
                  onClick={() => setPreferences({ ...preferences, preferredFormat: format.value })}
                  className={`p-3 border rounded-subtle transition-colors ${
                    preferences.preferredFormat === format.value
                      ? "border-sage bg-sage/10 text-sage"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* About Me */}
          <div>
            <label className="block text-sm font-medium mb-2">About Me</label>
            <textarea
              value={preferences.bio}
              onChange={(e) => setPreferences({ ...preferences, bio: e.target.value })}
              className="input min-h-[100px]"
              placeholder="Tell teachers about your musical goals and interests..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{preferences.bio.length}/500</p>
          </div>
        </div>
      </div>

      {/* Location & Budget */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Location & Budget</h2>
        
        <div className="space-y-6">
          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                className="input"
                placeholder="e.g., San Francisco"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code</label>
              <input
                type="text"
                value={preferences.zipCode}
                onChange={(e) => setPreferences({ ...preferences, zipCode: e.target.value })}
                className="input"
                placeholder="e.g., 94102"
              />
            </div>
          </div>

          {/* Travel Radius */}
          {preferences.preferredFormat !== "ONLINE" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Travel Radius: {preferences.travelRadius} miles
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={preferences.travelRadius}
                onChange={(e) => setPreferences({ ...preferences, travelRadius: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 mile</span>
                <span>25 miles</span>
                <span>50 miles</span>
              </div>
            </div>
          )}

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range (per hour)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={preferences.budgetMin}
                onChange={(e) => setPreferences({ ...preferences, budgetMin: e.target.value })}
                className="input"
                placeholder="Min ($)"
                min="0"
              />
              <input
                type="number"
                value={preferences.budgetMax}
                onChange={(e) => setPreferences({ ...preferences, budgetMax: e.target.value })}
                className="input"
                placeholder="Max ($)"
                min="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Goals */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Learning Goals</h2>
        
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-subtle">
            <p className="text-amber-800 text-sm">
              🎯 Setting clear goals helps teachers customize lessons for you
            </p>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Learn to read music</p>
                <p className="text-sm text-gray-600">Master music notation and sight-reading</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Play for fun</p>
                <p className="text-sm text-gray-600">Enjoy music as a hobby without pressure</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Perform publicly</p>
                <p className="text-sm text-gray-600">Prepare for recitals or performances</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Music theory</p>
                <p className="text-sm text-gray-600">Understand the fundamentals of music</p>
              </div>
            </label>
            
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />
              <div>
                <p className="font-medium">Prepare for exams</p>
                <p className="text-sm text-gray-600">Get ready for music grade examinations</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn btn-primary">
          Save Preferences
        </button>
      </div>
    </div>
  )
}