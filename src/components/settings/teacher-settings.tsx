"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"

interface TeacherSettingsProps {
  user: any // TODO: Add proper types
}

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

export default function TeacherSettings({ user }: TeacherSettingsProps) {
  // const router = useRouter()
  const profile = user.teacherProfile
  const [activeSection, setActiveSection] = useState("profile")
  
  const [profileData, setProfileData] = useState({
    bio: profile?.bio || "",
    yearsExperience: profile?.yearsExperience || 0,
    instrumentsTaught: profile?.instrumentsTaught || [],
    teachingStyles: profile?.teachingStyles || [],
    ageGroups: profile?.ageGroups || [],
    languages: profile?.languages || ["English"],
  })

  const [availability, setAvailability] = useState(
    profile?.weeklySchedule || 
    daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { available: false, startTime: "09:00", endTime: "17:00" }
    }), {})
  )

  const [rates, setRates] = useState(profile?.rates || [])
  const [newRate, setNewRate] = useState({
    duration: 60,
    price: "",
    description: "",
  })

  const handleProfileSave = async () => {
    // TODO: Implement API call
    console.log("Saving profile:", profileData)
  }

  const handleAvailabilitySave = async () => {
    // TODO: Implement API call
    console.log("Saving availability:", availability)
  }

  const handleAddRate = () => {
    if (newRate.price && newRate.duration) {
      setRates([...rates, { ...newRate, id: Date.now().toString() }])
      setNewRate({ duration: 60, price: "", description: "" })
    }
  }

  const handleDeleteRate = (id: string) => {
    setRates(rates.filter((r: any) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection("profile")}
            className={`px-4 py-2 rounded-subtle ${
              activeSection === "profile" ? "bg-sage text-paper" : "hover:bg-dust"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("availability")}
            className={`px-4 py-2 rounded-subtle ${
              activeSection === "availability" ? "bg-sage text-paper" : "hover:bg-dust"
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveSection("rates")}
            className={`px-4 py-2 rounded-subtle ${
              activeSection === "rates" ? "bg-sage text-paper" : "hover:bg-dust"
            }`}
          >
            Rates
          </button>
        </div>
      </div>

      {/* Profile Section */}
      {activeSection === "profile" && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-6">Teacher Profile</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Professional Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="input min-h-[150px]"
                placeholder="Describe your teaching philosophy and experience..."
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/2000</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="number"
                value={profileData.yearsExperience}
                onChange={(e) => setProfileData({ ...profileData, yearsExperience: parseInt(e.target.value) })}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instruments</label>
              <div className="grid grid-cols-3 gap-2">
                {["Piano", "Guitar", "Violin", "Drums", "Voice", "Bass", "Saxophone", "Trumpet", "Flute"].map(instrument => (
                  <label key={instrument} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={profileData.instrumentsTaught.includes(instrument)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProfileData({
                            ...profileData,
                            instrumentsTaught: [...profileData.instrumentsTaught, instrument]
                          })
                        } else {
                          setProfileData({
                            ...profileData,
                            instrumentsTaught: profileData.instrumentsTaught.filter((i: string) => i !== instrument)
                          })
                        }
                      }}
                    />
                    <span className="text-sm">{instrument}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={handleProfileSave} className="btn btn-primary">
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Availability Section */}
      {activeSection === "availability" && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-6">Weekly Availability</h2>
          
          <div className="space-y-4">
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center gap-4 py-3 border-b">
                <label className="flex items-center gap-2 w-32">
                  <input
                    type="checkbox"
                    checked={availability[day].available}
                    onChange={(e) => setAvailability({
                      ...availability,
                      [day]: { ...availability[day], available: e.target.checked }
                    })}
                  />
                  <span className="capitalize">{day}</span>
                </label>
                
                {availability[day].available && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={availability[day].startTime}
                      onChange={(e) => setAvailability({
                        ...availability,
                        [day]: { ...availability[day], startTime: e.target.value }
                      })}
                      className="px-3 py-1 border rounded-subtle"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={availability[day].endTime}
                      onChange={(e) => setAvailability({
                        ...availability,
                        [day]: { ...availability[day], endTime: e.target.value }
                      })}
                      className="px-3 py-1 border rounded-subtle"
                    />
                  </div>
                )}
              </div>
            ))}
            
            <button onClick={handleAvailabilitySave} className="btn btn-primary">
              Save Availability
            </button>
          </div>
        </div>
      )}

      {/* Rates Section */}
      {activeSection === "rates" && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-6">Lesson Rates</h2>
          
          {/* Current Rates */}
          <div className="space-y-3 mb-6">
            {rates.length > 0 ? (
              rates.map((rate: any) => (
                <div key={rate.id} className="flex items-center justify-between p-3 bg-dust rounded-subtle">
                  <div>
                    <p className="font-medium">{rate.duration} minutes - ${rate.price}</p>
                    {rate.description && (
                      <p className="text-sm text-gray-600">{rate.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteRate(rate.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No rates set up yet</p>
            )}
          </div>

          {/* Add New Rate */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Add New Rate</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm mb-1">Duration (minutes)</label>
                <select
                  value={newRate.duration}
                  onChange={(e) => setNewRate({ ...newRate, duration: parseInt(e.target.value) })}
                  className="input"
                >
                  <option value={30}>30</option>
                  <option value={45}>45</option>
                  <option value={60}>60</option>
                  <option value={90}>90</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Price ($)</label>
                <input
                  type="number"
                  value={newRate.price}
                  onChange={(e) => setNewRate({ ...newRate, price: e.target.value })}
                  className="input"
                  placeholder="50"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Description (optional)</label>
                <input
                  type="text"
                  value={newRate.description}
                  onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                  className="input"
                  placeholder="e.g., Beginner lesson"
                />
              </div>
            </div>
            
            <button onClick={handleAddRate} className="btn btn-secondary mt-3">
              Add Rate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}