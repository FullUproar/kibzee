"use client"

import { useState } from "react"
import Link from "next/link"
import GeneralSettings from "./general-settings"
import SecuritySettings from "./security-settings"
import NotificationSettings from "./notification-settings"

interface SettingsTabsProps {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: string
  }
}

export default function SettingsTabs({ user }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: "👤" },
    { id: "preferences", label: "Preferences", icon: "🎯", isLink: true, href: "/dashboard/preferences" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ]

  return (
    <div className="flex gap-8">
      {/* Sidebar Navigation */}
      <div className="w-64">
        <nav className="card p-4">
          {tabs.map((tab) =>
            tab.isLink && tab.href ? (
              <Link
                key={tab.id}
                href={tab.href}
                className="w-full text-left px-4 py-3 rounded-subtle mb-2 flex items-center gap-3 transition-colors hover:bg-dust"
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-subtle mb-2 flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? "bg-sage/10 text-sage font-medium"
                    : "hover:bg-dust"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          )}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        {activeTab === "general" && <GeneralSettings user={user} />}
        {activeTab === "security" && <SecuritySettings user={user} />}
        {activeTab === "notifications" && <NotificationSettings user={user} />}
      </div>
    </div>
  )
}
