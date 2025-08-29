"use client"

interface TimeSlotsProps {
  date: Date
  teacherSchedule: any
  duration: number
  onTimeSelect: (time: string) => void
}

export default function TimeSlots({ date, teacherSchedule, duration, onTimeSelect }: TimeSlotsProps) {
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const daySchedule = teacherSchedule[dayName]

  if (!daySchedule?.available) {
    return (
      <div className="text-center py-8 text-gray-500">
        Teacher is not available on this day
      </div>
    )
  }

  // Generate time slots based on teacher's availability
  const generateTimeSlots = () => {
    const slots = []
    const [startHour, startMin] = daySchedule.startTime.split(":").map(Number)
    const [endHour, endMin] = daySchedule.endTime.split(":").map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    for (let minutes = startMinutes; minutes + duration <= endMinutes; minutes += 30) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const time = `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
      const displayTime = new Date(2000, 0, 1, hours, mins).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      })
      
      slots.push({ time, displayTime })
    }
    
    return slots
  }

  const timeSlots = generateTimeSlots()

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available time slots for the selected duration
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {timeSlots.map(({ time, displayTime }) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className="p-3 border border-gray-300 rounded-subtle hover:border-sage hover:bg-sage/10 transition-colors"
          >
            {displayTime}
          </button>
        ))}
      </div>
    </div>
  )
}