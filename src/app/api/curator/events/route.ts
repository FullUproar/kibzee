import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { EventCategory } from "@prisma/client"
import slugify from "slugify"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is an approved curator or admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { curatorProfile: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const isAdmin = user.role === "ADMIN"
  const isApprovedCurator =
    user.role === "FOUNDER_CURATOR" ||
    user.role === "COMMUNITY_CURATOR" ||
    (user.curatorProfile?.status === "APPROVED")

  if (!isAdmin && !isApprovedCurator) {
    return NextResponse.json(
      { error: "You must be an approved curator to submit events" },
      { status: 403 }
    )
  }

  const body = await request.json()
  const {
    title,
    description,
    shortDescription,
    category,
    startDate,
    endDate,
    doorTime,
    venueId,
    priceMin,
    priceMax,
    isFree,
    ticketUrl,
    imageUrl,
    curatorNotes,
    isCuratedPick,
    artistIds,
  } = body

  // Validation
  if (!title || !description || !category || !startDate || !venueId) {
    return NextResponse.json(
      { error: "Title, description, category, start date, and venue are required" },
      { status: 400 }
    )
  }

  // Verify venue exists
  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
  })

  if (!venue) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 })
  }

  // Generate unique slug
  const baseSlug = slugify(title, { lower: true, strict: true })
  let slug = baseSlug
  let counter = 1

  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  // Create event
  const event = await prisma.event.create({
    data: {
      title,
      slug,
      description,
      shortDescription: shortDescription || null,
      category: category as EventCategory,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      doorTime: doorTime ? new Date(doorTime) : null,
      venueId,
      priceMin: priceMin ? Math.round(priceMin * 100) : null, // Convert to cents
      priceMax: priceMax ? Math.round(priceMax * 100) : null,
      isFree: isFree || false,
      ticketUrl: ticketUrl || null,
      imageUrl: imageUrl || null,
      curatorId: session.user.id,
      curatorNotes: curatorNotes || null,
      isCuratedPick: isCuratedPick || false,
      status: isAdmin ? "PUBLISHED" : "PENDING_REVIEW", // Auto-publish for admins
      sourceType: "manual",
    },
  })

  // Add artists if provided
  if (artistIds && artistIds.length > 0) {
    await prisma.eventArtist.createMany({
      data: artistIds.map((artistId: string, index: number) => ({
        eventId: event.id,
        artistId,
        order: index,
        role: index === 0 ? "headliner" : "performer",
      })),
    })
  }

  // Update curator stats
  if (user.curatorProfile) {
    await prisma.curatorProfile.update({
      where: { id: user.curatorProfile.id },
      data: {
        eventsSubmitted: { increment: 1 },
      },
    })
  }

  return NextResponse.json(event, { status: 201 })
}

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  // Get events submitted by this curator
  const events = await prisma.event.findMany({
    where: {
      curatorId: session.user.id,
      ...(status && { status: status as "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "CANCELLED" | "COMPLETED" }),
    },
    include: {
      venue: {
        select: {
          name: true,
          city: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ events })
}
