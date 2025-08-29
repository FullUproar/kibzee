"use client"

import Link from "next/link"
import { formatDistanceToNow, formatDateTime } from "@/utils/date"

interface TeacherDashboardProps {
  user: any // TODO: Add proper types
}

export default function TeacherDashboard({ user }: TeacherDashboardProps) {
  const upcomingLessons = user.teacherBookings?.filter(
    (booking: any) => new Date(booking.lessonDate) > new Date() && booking.status === "CONFIRMED"
  ) || []

  const pendingRequests = user.teacherBookings?.filter(
    (booking: any) => booking.status === "PENDING"
  ) || []

  const completedLessons = user.teacherBookings?.filter(
    (booking: any) => booking.status === "COMPLETED"
  ) || []

  // Calculate earnings (mock data for now)
  // const totalEarnings = completedLessons.reduce(
  //   (sum: number, booking: any) => sum + (booking.price - booking.platformFee),
  //   0
  // )

  const thisMonthEarnings = completedLessons
    .filter((booking: any) => {
      const bookingDate = new Date(booking.lessonDate)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, booking: any) => sum + (booking.price - booking.platformFee), 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-ink mb-2">
          Welcome back, {user.name?.split(" ")[0] || "Teacher"}!
        </h1>
        <p className="text-gray-600">Here's your teaching overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">This Month</span>
            <span className="text-2xl">💰</span>
          </div>
          <div className="text-2xl font-serif text-sage">
            ${(thisMonthEarnings / 100).toFixed(2)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Earnings after fees</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Students</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-2xl font-serif text-clay">
            {new Set(user.teacherBookings?.map((b: any) => b.studentId)).size || 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Unique students</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Upcoming</span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="text-2xl font-serif text-gold">
            {upcomingLessons.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Scheduled lessons</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending</span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-2xl font-serif text-ink">
            {pendingRequests.length}
          </div>
          <p className="text-xs text-gray-500 mt-1">Booking requests</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-2xl">Today's Schedule</h2>
            <Link
              href="/dashboard/schedule"
              className="text-sm text-sage hover:text-primary-600"
            >
              View full schedule →
            </Link>
          </div>
          
          {upcomingLessons.filter((booking: any) => {
            const today = new Date()
            const lessonDate = new Date(booking.lessonDate)
            return lessonDate.toDateString() === today.toDateString()
          }).length > 0 ? (
            <div className="space-y-4">
              {upcomingLessons
                .filter((booking: any) => {
                  const today = new Date()
                  const lessonDate = new Date(booking.lessonDate)
                  return lessonDate.toDateString() === today.toDateString()
                })
                .map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 bg-dust/30 rounded-subtle"
                  >
                    <div className="text-center min-w-[60px]">
                      <div className="text-sm font-medium">
                        {formatDateTime(new Date(booking.lessonDate))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {booking.student.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {booking.instrument} • {booking.duration} min • {booking.format}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/lessons/${booking.id}`}
                      className="btn btn-sm btn-secondary"
                    >
                      View
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-3">📚</div>
              <p>No lessons scheduled for today</p>
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl">Pending Requests</h2>
            {pendingRequests.length > 0 && (
              <span className="bg-clay text-white text-xs px-2 py-1 rounded-full">
                {pendingRequests.length}
              </span>
            )}
          </div>
          
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((booking: any) => (
                <div key={booking.id} className="border-l-4 border-gold pl-3">
                  <h4 className="font-medium text-sm">{booking.student.name}</h4>
                  <p className="text-xs text-gray-600">
                    {booking.instrument} • {formatDateTime(new Date(booking.lessonDate))}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="text-xs text-sage hover:text-primary-600 font-medium">
                      Accept
                    </button>
                    <span className="text-xs text-gray-400">•</span>
                    <button className="text-xs text-clay hover:text-secondary-600 font-medium">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
              {pendingRequests.length > 3 && (
                <Link
                  href="/dashboard/requests"
                  className="block text-center text-sm text-sage hover:text-primary-600 pt-2"
                >
                  View all requests →
                </Link>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No pending requests
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6 mt-8">
        <Link
          href="/dashboard/availability"
          className="card p-6 text-center hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-2">📅</div>
          <h3 className="font-medium">Update Availability</h3>
        </Link>

        <Link
          href="/dashboard/profile"
          className="card p-6 text-center hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-2">👤</div>
          <h3 className="font-medium">Edit Profile</h3>
        </Link>

        <Link
          href="/dashboard/rates"
          className="card p-6 text-center hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-2">💵</div>
          <h3 className="font-medium">Manage Rates</h3>
        </Link>

        <Link
          href="/dashboard/students"
          className="card p-6 text-center hover:shadow-medium transition-shadow"
        >
          <div className="text-3xl mb-2">👥</div>
          <h3 className="font-medium">My Students</h3>
        </Link>
      </div>

      {/* Recent Reviews */}
      <div className="mt-8 card p-6">
        <h2 className="font-serif text-2xl mb-4">Recent Reviews</h2>
        {user.reviewsReceived?.length > 0 ? (
          <div className="space-y-4">
            {user.reviewsReceived.slice(0, 3).map((review: any) => (
              <div key={review.id} className="border-b border-dust pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-gold">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(review.createdAt))} ago
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">— {review.author.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Keep teaching to earn your first review!
          </p>
        )}
      </div>
    </div>
  )
}