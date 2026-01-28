"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon?: string
}

interface DashboardNavProps {
  userRole: "USER" | "FOUNDER_CURATOR" | "COMMUNITY_CURATOR" | "ADMIN"
  userName?: string | null
  userImage?: string | null
}

export default function DashboardNav({ userRole, userName, userImage }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠" },
    { label: "Events", href: "/events", icon: "📅" },
    { label: "Concierge", href: "/concierge", icon: "💬" },
    { label: "Saved", href: "/dashboard/saved", icon: "❤️" },
    { label: "Preferences", href: "/dashboard/preferences", icon: "⚙️" },
    { label: "Become a Curator", href: "/curator/apply", icon: "✨" },
    { label: "Settings", href: "/settings", icon: "👤" },
  ]

  const curatorNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "🏠" },
    { label: "Events", href: "/events", icon: "📅" },
    { label: "Concierge", href: "/concierge", icon: "💬" },
    { label: "Curator Hub", href: "/curator", icon: "✨" },
    { label: "Add Event", href: "/curator/events/new", icon: "➕" },
    { label: "Saved", href: "/dashboard/saved", icon: "❤️" },
    { label: "Settings", href: "/settings", icon: "👤" },
  ]

  const adminNavItems: NavItem[] = [
    { label: "Admin Dashboard", href: "/admin", icon: "🛡️" },
    { label: "Browse Events", href: "/events", icon: "📅" },
    { label: "Concierge", href: "/concierge", icon: "💬" },
    { label: "Curator Hub", href: "/curator", icon: "✨" },
    { label: "Add Event", href: "/curator/events/new", icon: "➕" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ]

  const isCurator = userRole === "FOUNDER_CURATOR" || userRole === "COMMUNITY_CURATOR"
  const navItems =
    userRole === "ADMIN" ? adminNavItems :
    isCurator ? curatorNavItems :
    userNavItems

  const roleLabel =
    userRole === "ADMIN" ? "Admin" :
    userRole === "FOUNDER_CURATOR" ? "Founder Curator" :
    userRole === "COMMUNITY_CURATOR" ? "Curator" :
    "Member"

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-dust min-h-screen">
        <div className="p-6 border-b border-dust">
          <Link href="/" className="text-2xl font-serif text-ink">
            kibzee<span className="text-clay ml-1">•</span>
          </Link>
        </div>

        <div className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-subtle transition-colors ${
                    isActive(item.href)
                      ? "bg-sage text-white"
                      : "text-ink hover:bg-dust"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-dust">
          <div className="flex items-center gap-3 px-4 py-3">
            {userImage ? (
              <img
                src={userImage}
                alt={userName || "User"}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                <span className="text-sage font-bold">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{userName || "User"}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full mt-2 px-4 py-2 text-left text-sm text-gray-600 hover:bg-dust rounded-subtle transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-dust z-50">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="text-xl font-serif text-ink">
              kibzee<span className="text-clay ml-1">•</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-16">
            <div className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-subtle transition-colors ${
                        isActive(item.href)
                          ? "bg-sage text-white"
                          : "text-ink hover:bg-dust"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-dust">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-4 py-3 text-left text-ink hover:bg-dust rounded-subtle transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
