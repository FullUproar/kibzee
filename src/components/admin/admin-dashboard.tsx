"use client"

import { useState } from "react"
import { Users, Calendar, MapPin, AlertTriangle, Shield, BarChart3, Settings, Music2, Check, X, Loader2 } from "lucide-react"

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalCurators: number
    pendingCurators: number
    totalEvents: number
    publishedEvents: number
    pendingEvents: number
    totalVenues: number
    totalArtists: number
    recentEvents: any[]
    recentUsers: any[]
    pendingCuratorsList: any[]
    pendingEventsList: any[]
  }
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [pendingCurators, setPendingCurators] = useState(stats.pendingCuratorsList || [])
  const [pendingEvents, setPendingEvents] = useState(stats.pendingEventsList || [])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCuratorAction = async (curatorId: string, action: 'approve' | 'reject') => {
    setActionLoading(curatorId)
    try {
      const response = await fetch('/api/admin/curators', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curatorId, action }),
      })

      if (response.ok) {
        setPendingCurators((prev: any[]) => prev.filter((c: any) => c.id !== curatorId))
      }
    } catch (error) {
      console.error('Failed to update curator:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleEventAction = async (eventId: string, action: 'publish' | 'reject') => {
    setActionLoading(eventId)
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action }),
      })

      if (response.ok) {
        setPendingEvents((prev: any[]) => prev.filter((e: any) => e.id !== eventId))
      }
    } catch (error) {
      console.error('Failed to update event:', error)
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-ink mb-8">Admin Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="border-b border-dust mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'events', label: 'Events', icon: Calendar, badge: pendingEvents.length },
              { id: 'curators', label: 'Curators', icon: Shield, badge: pendingCurators.length },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'venues', label: 'Venues', icon: MapPin },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-sage text-sage'
                    : 'border-transparent text-gray-600 hover:text-ink'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-sage" />
                  <span className="text-2xl font-bold text-ink">{stats.totalEvents}</span>
                </div>
                <p className="text-gray-600">Total Events</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.publishedEvents} published, {stats.pendingEvents} pending
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-clay" />
                  <span className="text-2xl font-bold text-ink">{stats.totalUsers}</span>
                </div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.totalCurators} curators
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <MapPin className="w-8 h-8 text-gold" />
                  <span className="text-2xl font-bold text-ink">{stats.totalVenues}</span>
                </div>
                <p className="text-gray-600">Venues</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Music2 className="w-8 h-8 text-sage" />
                  <span className="text-2xl font-bold text-ink">{stats.totalArtists}</span>
                </div>
                <p className="text-gray-600">Artists</p>
              </div>
            </div>

            {/* Pending Actions Alert */}
            {(pendingEvents.length > 0 || pendingCurators.length > 0) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">
                      {pendingEvents.length + pendingCurators.length} Pending Actions
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {pendingEvents.length > 0 && `${pendingEvents.length} events need review`}
                      {pendingEvents.length > 0 && pendingCurators.length > 0 && ', '}
                      {pendingCurators.length > 0 && `${pendingCurators.length} curator applications`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Events */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Recent Events</h2>
                <div className="space-y-3">
                  {stats.recentEvents.map(event => (
                    <div key={event.id} className="flex justify-between items-center py-2 border-b border-dust">
                      <div>
                        <p className="font-medium text-ink">{event.title}</p>
                        <p className="text-sm text-gray-500">
                          {event.venue?.name} • {formatDate(event.startDate)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        event.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                        event.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Recent Users</h2>
                <div className="space-y-3">
                  {stats.recentUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center py-2 border-b border-dust">
                      <div>
                        <p className="font-medium text-ink">{user.name || user.email}</p>
                        <p className="text-sm text-gray-500">
                          {user.role} • Joined {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.status === 'PENDING_VERIFICATION' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-ink mb-6">Pending Event Reviews</h2>

            {pendingEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No events pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event: any) => (
                  <div key={event.id} className="border border-dust rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-ink">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.venue?.name}, {event.venue?.city} • {formatDate(event.startDate)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted by: {event.curator?.curatorProfile?.displayName || event.curator?.name || event.curator?.email}
                        </p>
                        {event.curatorNotes && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{event.curatorNotes}"
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEventAction(event.id, 'publish')}
                          disabled={actionLoading === event.id}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                        >
                          {actionLoading === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Publish
                        </button>
                        <button
                          onClick={() => handleEventAction(event.id, 'reject')}
                          disabled={actionLoading === event.id}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Curators Tab */}
        {activeTab === 'curators' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-ink mb-6">Pending Curator Applications</h2>

            {pendingCurators.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending curator applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingCurators.map((curator: any) => (
                  <div key={curator.id} className="border border-dust rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-ink">{curator.displayName}</h3>
                        <p className="text-sm text-gray-500">
                          {curator.user?.name || curator.user?.email}
                        </p>
                        {curator.bio && (
                          <p className="text-sm text-gray-600 mt-2">{curator.bio}</p>
                        )}
                        {curator.expertise && curator.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {curator.expertise.map((exp: string) => (
                              <span key={exp} className="px-2 py-0.5 bg-dust text-gray-600 rounded text-xs">
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Applied {formatDate(curator.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleCuratorAction(curator.id, 'approve')}
                          disabled={actionLoading === curator.id}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                        >
                          {actionLoading === curator.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleCuratorAction(curator.id, 'reject')}
                          disabled={actionLoading === curator.id}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-ink">User Management</h2>
              <div className="flex gap-4">
                <input
                  type="search"
                  placeholder="Search users..."
                  className="px-4 py-2 border border-gray-300 rounded-subtle"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-subtle">
                  <option>All Roles</option>
                  <option>Users</option>
                  <option>Founder Curators</option>
                  <option>Community Curators</option>
                  <option>Admins</option>
                </select>
              </div>
            </div>
            <p className="text-gray-600">Full user management coming soon...</p>
          </div>
        )}

        {/* Venues Tab */}
        {activeTab === 'venues' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-ink">Venue Management</h2>
              <button className="px-4 py-2 bg-sage text-white rounded-subtle hover:bg-sage/90">
                Add Venue
              </button>
            </div>
            <p className="text-gray-600">Venue management coming soon...</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-ink mb-6">Platform Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-ink mb-3">Content Settings</h3>
                <div className="flex items-center gap-4 mb-2">
                  <label className="text-gray-600">Auto-approve founder curator events:</label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-gray-600">Require review for community curator events:</label>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>

              <div>
                <h3 className="font-medium text-ink mb-3">Email Settings</h3>
                <button className="px-4 py-2 bg-sage text-white rounded-subtle hover:bg-sage/90">
                  Configure Email Templates
                </button>
              </div>

              <div>
                <h3 className="font-medium text-ink mb-3">AI Concierge</h3>
                <button className="px-4 py-2 bg-clay text-white rounded-subtle hover:bg-clay/90">
                  Manage Concierge Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
