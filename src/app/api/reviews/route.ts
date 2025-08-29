import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const teacherId = searchParams.get("teacherId")

    if (!teacherId) {
      return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { subjectId: teacherId },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json(
      { error: "Failed to get reviews" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    
    // Check if user has already reviewed this teacher for this booking
    const existingReview = await prisma.review.findFirst({
      where: {
        authorId: session.user.id,
        bookingId: data.bookingId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this lesson" },
        { status: 400 }
      )
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        authorId: session.user.id,
        subjectId: data.teacherId,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment
      }
    })

    // Update booking to mark as reviewed
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: "COMPLETED" }
    })

    // Create notification for teacher
    await prisma.notification.create({
      data: {
        userId: data.teacherId,
        type: "NEW_REVIEW",
        title: "New Review",
        content: `You received a ${data.rating}-star review`,
        data: { reviewId: review.id }
      }
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
}