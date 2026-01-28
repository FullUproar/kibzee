import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createEventNotifications } from "@/lib/matching/preference-matcher"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")
  const limit = parseInt(searchParams.get("limit") || "50")

  const events = await prisma.event.findMany({
    where: status
      ? { status: status as "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "CANCELLED" | "COMPLETED" }
      : {},
    include: {
      venue: {
        select: {
          name: true,
          city: true,
        },
      },
      curator: {
        select: {
          id: true,
          name: true,
          email: true,
          curatorProfile: {
            select: { displayName: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })

  return NextResponse.json({ events })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { eventId, action, featured, featuredOrder } = body

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { curator: { include: { curatorProfile: true } } },
  })

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  if (action === "publish") {
    const publishedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      include: {
        venue: true,
      },
    })

    // Update curator stats
    if (event.curator?.curatorProfile) {
      await prisma.curatorProfile.update({
        where: { id: event.curator.curatorProfile.id },
        data: { eventsApproved: { increment: 1 } },
      })
    }

    // Send notifications to matching users
    try {
      const { created } = await createEventNotifications(publishedEvent)
      console.log(`Created ${created} notifications for event ${publishedEvent.slug}`)
    } catch (err) {
      console.error("Failed to create event notifications:", err)
      // Don't fail the publish if notifications fail
    }

    return NextResponse.json({ success: true, status: "PUBLISHED" })
  }

  if (action === "reject") {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "CANCELLED" },
    })

    return NextResponse.json({ success: true, status: "CANCELLED" })
  }

  if (action === "unpublish") {
    await prisma.event.update({
      where: { id: eventId },
      data: { status: "DRAFT" },
    })

    return NextResponse.json({ success: true, status: "DRAFT" })
  }

  if (action === "feature") {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        featured: featured ?? true,
        featuredOrder: featuredOrder ?? null,
      },
    })

    return NextResponse.json({ success: true, featured: featured ?? true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
