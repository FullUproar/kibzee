"use client"

import { useState } from "react"

interface CalendarProps {
  teacherSchedule: any
  onDateSelect: (date: Date) => void
}

export default function Calendar({ teacherSchedule, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    if (date < today) return false
    
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const daySchedule = teacherSchedule[dayName]
    
    return daySchedule?.available || false
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const days = getDaysInMonth(currentMonth)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-dust rounded-subtle"
          disabled={currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear()}
        >
          ←
        </button>
        <h3 className="text-lg font-medium">
          {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-dust rounded-subtle"
        >
          →
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isAvailable = isDateAvailable(date)
          const isToday = date && date.toDateString() === today.toDateString()
          
          return (
            <button
              key={index}
              onClick={() => date && isAvailable && onDateSelect(date)}
              disabled={!date || !isAvailable}
              className={`
                aspect-square p-2 rounded-subtle transition-colors
                ${!date ? "invisible" : ""}
                ${isAvailable 
                  ? "hover:bg-sage/20 cursor-pointer" 
                  : "text-gray-400 cursor-not-allowed"
                }
                ${isToday ? "ring-2 ring-sage" : ""}
              `}
            >
              {date?.getDate()}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-sage/20 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 ring-2 ring-sage rounded"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}