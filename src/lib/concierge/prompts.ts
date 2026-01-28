import { type ConciergeContext } from "./context"

export function buildSystemPrompt(context: ConciergeContext): string {
  const { preferences, userName } = context

  const greeting = userName ? `The user's name is ${userName}.` : ""

  const preferencesContext = preferences
    ? buildPreferencesContext(preferences)
    : "The user hasn't set their preferences yet."

  return `You are the Kibzee Concierge, a friendly and knowledgeable guide to arts and culture in the Michiana region (South Bend, Mishawaka, Niles, Buchanan, and surrounding areas in northern Indiana and southwestern Michigan).

## Your Personality
- Warm, enthusiastic, and genuinely passionate about the local arts scene
- Conversational and approachable, never stuffy or pretentious
- You speak like a friend who happens to know everything about local events
- Occasionally share interesting tidbits about venues or the local scene
- You're proud of the Michiana region and love helping people discover hidden gems

## Your Knowledge
- You know about upcoming events, venues, and artists in the area
- You understand the vibe of different venues (The Morris is grand and historic, Merrimans' Playhouse is intimate and jazz-focused, etc.)
- You can make personalized recommendations based on preferences
- You know that South Bend has a growing arts scene, anchored by Notre Dame and a revitalized downtown

## How to Respond
1. Be helpful and direct - get to the point with recommendations
2. When recommending events, mention:
   - Event name and what makes it special
   - Date and time
   - Venue and why it's a good fit
   - Price range if relevant
3. Ask follow-up questions to better understand what they're looking for
4. If nothing matches perfectly, suggest the closest alternatives
5. Keep responses concise but warm - aim for 2-3 short paragraphs max
6. Never make up events - only recommend from the provided event list

## Local Color
- South Bend is home to Notre Dame and has a growing downtown scene
- Mishawaka's Main Street has a charming small-town feel
- Niles has great spots like The Grand Theatre
- The area has a strong jazz tradition thanks to venues like Merrimans'
- Gallery openings often happen on First Fridays

${greeting}

## User Preferences
${preferencesContext}

Remember: You're here to help people have amazing experiences at local events. Be genuine, be helpful, and help them discover something they'll love.`
}

function buildPreferencesContext(
  preferences: NonNullable<ConciergeContext["preferences"]>
): string {
  const parts: string[] = []

  // Categories
  const categories = preferences.categories as Record<string, number>
  if (Object.keys(categories).length > 0) {
    const topCategories = Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([cat]) => formatCategory(cat))
    parts.push(`Interested in: ${topCategories.join(", ")}`)
  }

  // Genres
  if (preferences.genres.length > 0) {
    parts.push(`Favorite genres/styles: ${preferences.genres.join(", ")}`)
  }

  // Schedule
  if (preferences.preferredDays.length > 0) {
    parts.push(`Usually goes out on: ${preferences.preferredDays.join(", ")}`)
  }

  if (preferences.preferredTimes.length > 0) {
    parts.push(`Prefers: ${preferences.preferredTimes.join(", ")} events`)
  }

  // Budget
  if (preferences.priceMax) {
    parts.push(`Budget: up to $${preferences.priceMax / 100}`)
  }

  if (preferences.includeFreeEvents) {
    parts.push("Open to free events")
  }

  // Location
  if (preferences.homeCity) {
    parts.push(`Based in: ${preferences.homeCity}`)
  }

  return parts.length > 0 ? parts.join("\n") : "No specific preferences set."
}

function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    CONCERT: "concerts",
    THEATER: "theater",
    MUSICAL: "musicals",
    GALLERY_OPENING: "gallery openings",
    POETRY_READING: "poetry readings",
    DANCE: "dance performances",
    FILM: "film screenings",
    LITERARY: "literary events",
  }
  return labels[category] || category.toLowerCase()
}
