"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { formatDateTime } from "@/utils/date"

interface TeacherProfileProps {
  teacher: any // TODO: Add proper types
}

export default function TeacherProfile({ teacher }: TeacherProfileProps) {
  const { data: session } = useSession()
  const [selectedRate, setSelectedRate] = useState(teacher.teacherProfile.rates[0])
  const [showBookingModal, setShowBookingModal] = useState(false)

  const profile = teacher.teacherProfile
  const avgRating = teacher.reviewsReceived.length > 0
    ? teacher.reviewsReceived.reduce((acc: number, r: any) => acc + r.rating, 0) / teacher.reviewsReceived.length
    : 0

  return (
    <div className="min-h-screen bg-dust">
      {/* Hero Section */}
      <div className="bg-paper border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Teacher Image */}
            <div className="md:w-1/3">
              <div className="relative">
                <img
                  src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name || "Teacher")}&background=7d8471&color=fff&size=200`}
                  alt={teacher.name}
                  className="w-full aspect-square object-cover rounded-subtle"
                />
                {profile.verifiedStatus === "VERIFIED" && (
                  <div className="absolute top-4 right-4 bg-sage text-paper px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Verified
                  </div>
                )}
              </div>
            </div>

            {/* Teacher Info */}
            <div className="md:w-2/3">
              <h1 className="text-3xl font-serif text-ink mb-2">{teacher.name}</h1>
              
              {/* Rating & Experience */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {avgRating > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-gold">★</span>
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">({teacher.reviewsReceived.length} reviews)</span>
                  </div>
                )}
                <span className="text-gray-600">
                  {profile.yearsExperience} years experience
                </span>
                <span className="text-gray-600">
                  {profile.city}, {profile.state}
                </span>
              </div>

              {/* Instruments */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Teaches</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.instrumentsTaught.map((instrument: string) => (
                    <span key={instrument} className="bg-sage/10 text-sage px-3 py-1 rounded-full text-sm">
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>

              {/* Booking CTA */}
              {session?.user && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="btn btn-primary"
                  >
                    Book a Lesson
                  </button>
                  <Link href={`/messages?userId=${teacher.id}`} className="btn btn-secondary">
                    Send Message
                  </Link>
                </div>
              )}
              {!session?.user && (
                <Link href="/register" className="btn btn-primary">
                  Sign Up to Book Lessons
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Teaching Details */}
            <div className="card p-6">
              <h2 className="text-xl font-serif mb-4">Teaching Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Teaching Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.teachingStyles.map((style: string) => (
                      <span key={style} className="bg-dust px-3 py-1 rounded-subtle text-sm">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Age Groups</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.ageGroups.map((group: string) => (
                      <span key={group} className="bg-dust px-3 py-1 rounded-subtle text-sm">
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang: string) => (
                      <span key={lang} className="bg-dust px-3 py-1 rounded-subtle text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Lesson Formats</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.lessonFormats?.map((format: string) => (
                      <span key={format} className="bg-dust px-3 py-1 rounded-subtle text-sm">
                        {format === "IN_PERSON" ? "In Person" : format === "ONLINE" ? "Online" : "Hybrid"}
                      </span>
                    )) || (
                      <>
                        <span className="bg-dust px-3 py-1 rounded-subtle text-sm">In Person</span>
                        <span className="bg-dust px-3 py-1 rounded-subtle text-sm">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {teacher.reviewsReceived.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-serif mb-4">Student Reviews</h2>
                <div className="space-y-4">
                  {teacher.reviewsReceived.map((review: any) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.author.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.author.name || "Student")}&background=c97d60&color=fff&size=40`}
                          alt={review.author.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.author.name}</span>
                            <div className="flex text-gold text-sm">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm mb-1">{review.comment}</p>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rates */}
            <div className="card p-6">
              <h3 className="font-serif text-lg mb-4">Lesson Rates</h3>
              <div className="space-y-3">
                {teacher.teacherProfile.rates.map((rate: any) => (
                  <label
                    key={rate.id}
                    className="flex items-center justify-between p-3 border rounded-subtle cursor-pointer hover:bg-dust/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="rate"
                        value={rate.id}
                        checked={selectedRate?.id === rate.id}
                        onChange={() => setSelectedRate(rate)}
                        className="text-sage"
                      />
                      <div>
                        <div className="font-medium">{rate.duration} minutes</div>
                        {rate.description && (
                          <div className="text-sm text-gray-600">{rate.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-medium text-sage">
                      ${(rate.price / 100).toFixed(2)}
                    </div>
                  </label>
                ))}
                {profile.trialLessonRate && (
                  <div className="pt-3 border-t">
                    <div className="text-sm text-gray-600 mb-1">Trial Lesson Available</div>
                    <div className="text-lg font-medium text-clay">
                      ${(profile.trialLessonRate / 100).toFixed(2)}/hour
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Preview */}
            <div className="card p-6">
              <h3 className="font-serif text-lg mb-4">Availability</h3>
              <p className="text-sm text-gray-600 mb-3">
                Check available times when booking
              </p>
              <div className="space-y-1 text-sm">
                {Object.entries(profile.weeklySchedule || {}).map(([day, times]: [string, any]) => (
                  times.available && (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize">{day}</span>
                      <span className="text-gray-600">
                        {times.startTime} - {times.endTime}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Safety Badge */}
            <div className="card p-6 bg-sage/5 border-sage/20">
              <h3 className="font-medium mb-3">Safety & Trust</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sage">✓</span>
                  <span>Identity Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sage">✓</span>
                  <span>Background Check Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sage">✓</span>
                  <span>Secure Payments via Kibzee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-paper rounded-subtle max-w-lg w-full p-6">
            <h2 className="text-xl font-serif mb-4">Book a Lesson with {teacher.name}</h2>
            <p className="text-gray-600 mb-6">
              Booking system coming soon! For now, please send a message to discuss scheduling.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <Link
                href={`/messages?userId=${teacher.id}`}
                className="btn btn-primary flex-1 text-center"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}