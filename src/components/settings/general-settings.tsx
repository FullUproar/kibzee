"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface GeneralSettingsProps {
  user: any // TODO: Add proper types
}

export default function GeneralSettings({ user }: GeneralSettingsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    image: user.image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-serif mb-6">General Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <img
              src={formData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=7d8471&color=fff&size=80`}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <button type="button" className="btn btn-secondary btn-sm">
                Change Photo
              </button>
              <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
            required
          />
          {!user.emailVerified && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Email not verified. <button type="button" className="underline">Verify now</button>
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="input"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Account Type</label>
          <div className="px-4 py-3 bg-dust rounded-subtle">
            <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
            {user.status !== "ACTIVE" && (
              <span className="ml-2 text-sm text-amber-600">
                ({user.status.replace(/_/g, " ").toLowerCase()})
              </span>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div>
          <label className="block text-sm font-medium mb-2">Member Since</label>
          <div className="px-4 py-3 bg-dust rounded-subtle">
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}