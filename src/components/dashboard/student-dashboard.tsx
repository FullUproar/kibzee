"use client"

import Link from "next/link"
import { formatDistanceToNow } from "@/utils/date"

interface StudentDashboardProps {
  user: any // TODO: Add proper types
}

export default function StudentDashboard({ user }: StudentDashboardProps) {
  const upcomingLessons = user.studentBookings?.filter(
    (booking: any) => new Date(booking.lessonDate) > new Date() && booking.status === "CONFIRMED"
  ) || []

  const pastLessons = user.studentBookings?.filter(
    (booking: any) => new Date(booking.lessonDate) <= new Date()
  ) || []

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-ink mb-2">
          Welcome back, {user.name?.split(" ")[0] || "Student"}!
        </h1>
        <p className="text-gray-600">Ready to continue your musical journey?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/teachers"
          className="card p-6 hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-serif text-xl mb-2">Find Teachers</h3>
          <p className="text-sm text-gray-600">
            Browse qualified instructors in your area
          </p>
        </Link>

        <Link
          href="/dashboard/lessons"
          className="card p-6 hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-serif text-xl mb-2">My Lessons</h3>
          <p className="text-sm text-gray-600">
            View your lesson history and upcoming sessions
          </p>
        </Link>

        <Link
          href="/dashboard/messages"
          className="card p-6 hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-serif text-xl mb-2">Messages</h3>
          <p className="text-sm text-gray-600">
            Chat with your teachers
          </p>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Lessons */}
        <div className="card p-6">
          <h2 className="font-serif text-2xl mb-4">Upcoming Lessons</h2>
          {upcomingLessons.length > 0 ? (
            <div className="space-y-4">
              {upcomingLessons.slice(0, 3).map((booking: any) => (
                <div
                  key={booking.id}
                  className="border-l-4 border-sage pl-4 py-2"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium">
                      {booking.instrument} with {booking.teacher.name}
                    </h4>
                    <span className="text-xs bg-sage/10 text-sage px-2 py-1 rounded">
                      {booking.format}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.lessonDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.duration} minutes • ${(booking.price / 100).toFixed(2)}
                  </p>
                </div>
              ))}
              {upcomingLessons.length > 3 && (
                <Link
                  href="/dashboard/lessons"
                  className="block text-center text-sage hover:text-primary-600 text-sm font-medium pt-2"
                >
                  View all {upcomingLessons.length} upcoming lessons →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🎵</div>
              <p className="text-gray-600 mb-4">No upcoming lessons scheduled</p>
              <Link
                href="/teachers"
                className="btn btn-primary inline-block"
              >
                Find a Teacher
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="font-serif text-2xl mb-4">Recent Activity</h2>
          {pastLessons.length > 0 ? (
            <div className="space-y-4">
              {pastLessons.slice(0, 3).map((booking: any) => (
                <div key={booking.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-dust flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      Completed {booking.instrument} lesson with{" "}
                      <span className="font-medium">{booking.teacher.name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(booking.lessonDate))} ago
                    </p>
                    {booking.status === "COMPLETED" && !booking.review && (
                      <Link
                        href={`/dashboard/lessons/${booking.id}/review`}
                        className="text-xs text-sage hover:text-primary-600 font-medium mt-2 inline-block"
                      >
                        Leave a review →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No recent activity to show
            </p>
          )}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="mt-8 card p-6">
        <h2 className="font-serif text-2xl mb-4">Your Learning Journey</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-serif text-sage mb-1">
              {user.studentBookings?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Total Lessons</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif text-clay mb-1">
              {user.studentProfile?.instrumentsInterest?.length || 0}
            </div>
            <p className="text-sm text-gray-600">Instruments</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif text-gold mb-1">
              {new Set(user.studentBookings?.map((b: any) => b.teacherId)).size || 0}
            </div>
            <p className="text-sm text-gray-600">Teachers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif text-ink mb-1">
              {Math.round(
                (user.studentBookings?.reduce((acc: number, b: any) => acc + b.duration, 0) || 0) / 60
              )}
            </div>
            <p className="text-sm text-gray-600">Hours Learned</p>
          </div>
        </div>
      </div>
    </div>
  )
}