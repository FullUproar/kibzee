"use client"

import { useState } from "react"
import { formatDateTime } from "@/utils/date"

interface LessonsManagerProps {
  bookings: any[]
  userRole: string
  userId: string
}

export default function LessonsManager({ bookings, userRole }: LessonsManagerProps) {
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "PAST" | "PENDING">("UPCOMING")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)

  const now = new Date()

  const filteredBookings = bookings.filter(booking => {
    const lessonDate = new Date(booking.lessonDate)
    
    switch (filter) {
      case "UPCOMING":
        return lessonDate >= now && booking.status === "CONFIRMED"
      case "PAST":
        return lessonDate < now || booking.status === "COMPLETED"
      case "PENDING":
        return booking.status === "PENDING"
      case "ALL":
      default:
        return true
    }
  })

  const handleAction = async (bookingId: string, action: string) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action })
      })

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to update booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-600 bg-green-50"
      case "PENDING":
        return "text-amber-600 bg-amber-50"
      case "COMPLETED":
        return "text-blue-600 bg-blue-50"
      case "CANCELLED":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["UPCOMING", "PENDING", "PAST", "ALL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-subtle transition-colors ${
              filter === f
                ? "bg-sage text-white"
                : "bg-dust hover:bg-dust/70"
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Lessons List */}
      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-serif mb-2">No {filter.toLowerCase()} lessons</h3>
          <p className="text-gray-600">
            {filter === "UPCOMING" && "Book a lesson to get started!"}
            {filter === "PENDING" && "No pending lesson requests"}
            {filter === "PAST" && "No completed lessons yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const otherUser = userRole === "TEACHER" ? booking.student : booking.teacher
            const isPast = new Date(booking.lessonDate) < now
            
            return (
              <div key={booking.id} className="card p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <img
                      src={otherUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || "User")}&background=7d8471&color=fff&size=60`}
                      alt={otherUser.name}
                      className="w-15 h-15 rounded-full"
                    />
                    <div>
                      <h3 className="font-serif text-lg">
                        {userRole === "TEACHER" ? "Student: " : "Teacher: "}
                        {otherUser.name}
                      </h3>
                      <p className="text-gray-600">
                        {booking.instrument} • {booking.duration} minutes
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(booking.lessonDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Format: {booking.format === "IN_PERSON" ? "In Person" : "Online"}
                      </p>
                      {booking.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Note: {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="text-lg font-medium mt-2">
                      ${(booking.price / 100).toFixed(2)}
                    </p>

                    {/* Actions */}
                    {booking.status === "PENDING" && userRole === "TEACHER" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(booking.id, "CONFIRM")}
                          className="btn btn-primary btn-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(booking.id, "CANCEL")}
                          className="btn btn-secondary btn-sm"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {booking.status === "CONFIRMED" && !isPast && (
                      <button
                        onClick={() => handleAction(booking.id, "CANCEL")}
                        className="btn btn-secondary btn-sm mt-3"
                      >
                        Cancel
                      </button>
                    )}

                    {booking.status === "CONFIRMED" && isPast && userRole === "STUDENT" && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="btn btn-primary btn-sm mt-3"
                      >
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Review Modal */}
      {selectedBooking && (
        <ReviewModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  )
}

function ReviewModal({ booking, onClose }: { booking: any; onClose: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: booking.teacherId,
          bookingId: booking.id,
          rating,
          comment
        })
      })

      if (response.ok) {
        onClose()
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-paper rounded-subtle max-w-md w-full p-6">
        <h2 className="text-xl font-serif mb-4">Leave a Review</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? "text-gold" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input min-h-[100px]"
            placeholder="Share your experience..."
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !comment.trim()}
            className="btn btn-primary flex-1"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  )
}