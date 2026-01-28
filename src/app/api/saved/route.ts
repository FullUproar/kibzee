import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const upcoming = searchParams.get("upcoming") === "true"
  const limit = parseInt(searchParams.get("limit") || "20")
  const offset = parseInt(searchParams.get("offset") || "0")

  const whereClause: Record<string, unknown> = {
    userId: session.user.id,
  }

  if (upcoming) {
    whereClause.event = {
      startDate: { gte: new Date() },
      status: "PUBLISHED",
    }
  }

  const [savedEvents, total] = await Promise.all([
    prisma.savedEvent.findMany({
      where: whereClause,
      include: {
        event: {
          include: {
            venue: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                state: true,
                address: true,
              },
            },
            artists: {
              include: { artist: true },
              orderBy: { order: "asc" },
            },
            curator: {
              select: {
                id: true,
                name: true,
                curatorProfile: { select: { displayName: true } },
              },
            },
          },
        },
      },
      orderBy: {
        event: { startDate: "asc" },
      },
      take: limit,
      skip: offset,
    }),
    prisma.savedEvent.count({ where: whereClause }),
  ])

  return NextResponse.json({
    savedEvents,
    total,
    hasMore: offset + savedEvents.length < total,
  })
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { eventId } = body

  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 })
  }

  // Check if event exists
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  // Check if already saved
  const existing = await prisma.savedEvent.findUnique({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: "Event already saved" }, { status: 409 })
  }

  const savedEvent = await prisma.savedEvent.create({
    data: {
      userId: session.user.id,
      eventId,
    },
    include: {
      event: {
        include: {
          venue: true,
        },
      },
    },
  })

  return NextResponse.json(savedEvent, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const eventId = searchParams.get("eventId")

  if (!eventId) {
    return NextResponse.json({ error: "Event ID required" }, { status: 400 })
  }

  await prisma.savedEvent.delete({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId,
      },
    },
  })

  return NextResponse.json({ success: true })
}
