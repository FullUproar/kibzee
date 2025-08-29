export function formatDistanceToNow(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " years"
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " months"
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " days"
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " hours"
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " minutes"
  
  return Math.floor(seconds) + " seconds"
}

export function formatDate(date: Date, format: "short" | "long" | "time" = "short"): string {
  const options: Intl.DateTimeFormatOptions = 
    format === "long" ? {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    } : format === "time" ? {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    } : {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  
  return new Intl.DateTimeFormat("en-US", options).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export function isUpcoming(date: Date): boolean {
  return date > new Date()
}

export function isPast(date: Date): boolean {
  return date < new Date()
}