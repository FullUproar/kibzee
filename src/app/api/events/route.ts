import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { EventCategory, EventStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse query parameters
    const category = searchParams.get("category") as EventCategory | null
    const city = searchParams.get("city")
    const search = searchParams.get("search")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const isFree = searchParams.get("free") === "true"
    const featured = searchParams.get("featured") === "true"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build where clause
    const where: any = {
      status: EventStatus.PUBLISHED,
    }

    if (category) {
      where.category = category
    }

    if (city) {
      where.venue = {
        city: {
          contains: city,
          mode: "insensitive",
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { venue: { name: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (startDate) {
      where.startDate = {
        ...where.startDate,
        gte: new Date(startDate),
      }
    } else {
      // Default to upcoming events only
      where.startDate = {
        gte: new Date(),
      }
    }

    if (endDate) {
      where.startDate = {
        ...where.startDate,
        lte: new Date(endDate),
      }
    }

    if (isFree) {
      where.isFree = true
    }

    if (featured) {
      where.featured = true
    }

    // Fetch events
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
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
          curator: {
            select: {
              id: true,
              name: true,
              curatorProfile: {
                select: {
                  displayName: true,
                },
              },
            },
          },
          artists: {
            include: {
              artist: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  primaryGenre: true,
                },
              },
            },
            orderBy: { order: "asc" },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: featured
          ? [{ featuredOrder: "asc" }, { startDate: "asc" }]
          : { startDate: "asc" },
        take: limit,
        skip: offset,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      total,
      limit,
      offset,
      hasMore: offset + events.length < total,
    })
  } catch (error) {
    console.error("Events API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}
