"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"

interface SecuritySettingsProps {
  user: any // TODO: Add proper types
}

export default function SecuritySettings({ user }: SecuritySettingsProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match")
      return
    }

    // TODO: Implement password change API
    console.log("Changing password...")
  }

  const handleDeleteAccount = async () => {
    if (confirm("Are you absolutely sure? This action cannot be undone.")) {
      // TODO: Implement account deletion API
      console.log("Deleting account...")
      await signOut({ callbackUrl: "/" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Password</h2>
        
        {!showPasswordForm ? (
          <div>
            <p className="text-gray-600 mb-4">
              Last changed: {user.lastPasswordChange ? 
                new Date(user.lastPasswordChange).toLocaleDateString() : 
                "Never"}
            </p>
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn btn-secondary"
            >
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="input"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                className="input"
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswords({ current: "", new: "", confirm: "" })
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Two-Factor Authentication</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">
              Add an extra layer of security to your account
            </p>
            <p className="text-sm text-gray-500">
              Status: {user.twoFactorEnabled ? 
                <span className="text-green-600 font-medium">Enabled</span> : 
                <span className="text-gray-600">Disabled</span>}
            </p>
          </div>
          <button className="btn btn-secondary">
            {user.twoFactorEnabled ? "Manage" : "Enable"}
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="card p-6">
        <h2 className="text-xl font-serif mb-6">Active Sessions</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-gray-600">
                {typeof window !== "undefined" ? window.navigator.userAgent.substring(0, 50) : "Browser"}...
              </p>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
            <span className="text-green-500 text-sm">● Active</span>
          </div>
        </div>
        
        <button className="btn btn-secondary mt-4">
          Sign Out All Other Sessions
        </button>
      </div>

      {/* Delete Account */}
      <div className="card p-6 border-red-200 bg-red-50">
        <h2 className="text-xl font-serif mb-6 text-red-800">Danger Zone</h2>
        
        {!showDeleteConfirm ? (
          <div>
            <p className="text-gray-700 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-subtle border border-red-300">
              <p className="text-red-800 font-medium mb-2">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Your profile and all personal information</li>
                <li>• All lesson history and bookings</li>
                <li>• All messages and reviews</li>
                <li>• Any remaining balance or credits</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}