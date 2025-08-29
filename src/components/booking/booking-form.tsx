"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Calendar from "./calendar"
import TimeSlots from "./time-slots"

interface BookingFormProps {
  teacher: any // TODO: Add proper types
  student: any
}

export default function BookingForm({ teacher, student }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [bookingData, setBookingData] = useState({
    teacherId: teacher.id,
    studentId: student.id,
    date: null as Date | null,
    time: "",
    duration: teacher.teacherProfile.rates[0]?.duration || 60,
    price: teacher.teacherProfile.rates[0]?.price || 0,
    lessonFormat: "IN_PERSON" as "IN_PERSON" | "ONLINE",
    message: "",
    instrument: teacher.teacherProfile.instrumentsTaught[0] || "",
  })

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, date, time: "" })
    setStep(2)
  }

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time })
    setStep(3)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          lessonDate: new Date(
            bookingData.date!.toDateString() + " " + bookingData.time
          ).toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard/lessons?booking=${data.bookingId}`)
      }
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setLoading(false)
    }
  }

  // const selectedRate = teacher.teacherProfile.rates.find(
  //   (r: any) => r.duration === bookingData.duration
  // )

  return (
    <div>
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={teacher.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=7d8471&color=fff&size=80`}
            alt={teacher.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-serif">Book a Lesson with {teacher.name}</h1>
            <p className="text-gray-600">
              {teacher.teacherProfile.city}, {teacher.teacherProfile.state}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 mx-1 rounded-full ${
                s <= step ? "bg-sage" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Select Date</span>
          <span>Choose Time</span>
          <span>Lesson Details</span>
          <span>Confirm</span>
        </div>
      </div>

      {/* Step 1: Select Date */}
      {step === 1 && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-4">Select a Date</h2>
          <Calendar
            teacherSchedule={teacher.teacherProfile.weeklySchedule}
            onDateSelect={handleDateSelect}
          />
        </div>
      )}

      {/* Step 2: Select Time */}
      {step === 2 && bookingData.date && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-4">
            Choose a Time for {bookingData.date.toLocaleDateString()}
          </h2>
          <TimeSlots
            date={bookingData.date}
            teacherSchedule={teacher.teacherProfile.weeklySchedule}
            duration={bookingData.duration}
            onTimeSelect={handleTimeSelect}
          />
          <button
            onClick={() => setStep(1)}
            className="btn btn-secondary mt-4"
          >
            Back to Calendar
          </button>
        </div>
      )}

      {/* Step 3: Lesson Details */}
      {step === 3 && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-6">Lesson Details</h2>
          
          <div className="space-y-4">
            {/* Instrument */}
            <div>
              <label className="block text-sm font-medium mb-2">Instrument</label>
              <select
                value={bookingData.instrument}
                onChange={(e) => setBookingData({ ...bookingData, instrument: e.target.value })}
                className="input"
              >
                {teacher.teacherProfile.instrumentsTaught.map((instrument: string) => (
                  <option key={instrument} value={instrument}>
                    {instrument}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration & Price */}
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <div className="grid grid-cols-3 gap-3">
                {teacher.teacherProfile.rates.map((rate: any) => (
                  <button
                    key={rate.id}
                    onClick={() => setBookingData({ 
                      ...bookingData, 
                      duration: rate.duration,
                      price: rate.price
                    })}
                    className={`p-3 border rounded-subtle ${
                      bookingData.duration === rate.duration
                        ? "border-sage bg-sage/10"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="font-medium">{rate.duration} min</div>
                    <div className="text-sm text-gray-600">
                      ${(rate.price / 100).toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium mb-2">Lesson Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setBookingData({ ...bookingData, lessonFormat: "IN_PERSON" })}
                  className={`p-3 border rounded-subtle ${
                    bookingData.lessonFormat === "IN_PERSON"
                      ? "border-sage bg-sage/10"
                      : "border-gray-300"
                  }`}
                >
                  In Person
                </button>
                <button
                  onClick={() => setBookingData({ ...bookingData, lessonFormat: "ONLINE" })}
                  className={`p-3 border rounded-subtle ${
                    bookingData.lessonFormat === "ONLINE"
                      ? "border-sage bg-sage/10"
                      : "border-gray-300"
                  }`}
                >
                  Online
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Message for Teacher (Optional)
              </label>
              <textarea
                value={bookingData.message}
                onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                className="input min-h-[100px]"
                placeholder="Let the teacher know about your goals, experience level, or any questions..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="btn btn-primary flex-1"
            >
              Continue to Review
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="card p-6">
          <h2 className="text-xl font-serif mb-6">Review & Confirm</h2>
          
          <div className="bg-dust p-4 rounded-subtle mb-6">
            <h3 className="font-medium mb-3">Lesson Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Teacher:</span>
                <span>{teacher.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{bookingData.date?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span>{bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span>{bookingData.duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Instrument:</span>
                <span>{bookingData.instrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span>{bookingData.lessonFormat === "IN_PERSON" ? "In Person" : "Online"}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium text-base">
                <span>Total:</span>
                <span className="text-sage">${(bookingData.price / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-subtle mb-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Payment will be processed after the teacher confirms your booking.
              You won&apos;t be charged if the teacher declines or doesn&apos;t respond within 48 hours.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}