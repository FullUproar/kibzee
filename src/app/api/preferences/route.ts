import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  })

  if (!preferences) {
    // Return default preferences structure
    return NextResponse.json({
      categories: {},
      genres: [],
      priceMin: null,
      priceMax: null,
      includeFreeEvents: true,
      maxDistance: null,
      preferredDays: [],
      preferredTimes: [],
      notifyNewEvents: true,
      notifyMatches: true,
      notifyWeekly: true,
      emailDigest: "weekly",
      homeCity: null,
      homeZip: null,
    })
  }

  return NextResponse.json(preferences)
}

export async function PUT(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const {
    categories,
    genres,
    priceMin,
    priceMax,
    includeFreeEvents,
    maxDistance,
    preferredDays,
    preferredTimes,
    notifyNewEvents,
    notifyMatches,
    notifyWeekly,
    emailDigest,
    homeCity,
    homeZip,
  } = body

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: {
      categories: categories ?? {},
      genres: genres ?? [],
      priceMin,
      priceMax,
      includeFreeEvents: includeFreeEvents ?? true,
      maxDistance,
      preferredDays: preferredDays ?? [],
      preferredTimes: preferredTimes ?? [],
      notifyNewEvents: notifyNewEvents ?? true,
      notifyMatches: notifyMatches ?? true,
      notifyWeekly: notifyWeekly ?? true,
      emailDigest: emailDigest ?? "weekly",
      homeCity,
      homeZip,
    },
    create: {
      userId: session.user.id,
      categories: categories ?? {},
      genres: genres ?? [],
      priceMin,
      priceMax,
      includeFreeEvents: includeFreeEvents ?? true,
      maxDistance,
      preferredDays: preferredDays ?? [],
      preferredTimes: preferredTimes ?? [],
      notifyNewEvents: notifyNewEvents ?? true,
      notifyMatches: notifyMatches ?? true,
      notifyWeekly: notifyWeekly ?? true,
      emailDigest: emailDigest ?? "weekly",
      homeCity,
      homeZip,
    },
  })

  return NextResponse.json(preferences)
}
