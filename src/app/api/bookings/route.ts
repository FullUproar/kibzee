import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's bookings based on role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentBookings: {
          include: {
            teacher: {
              select: {
                name: true,
                image: true,
                teacherProfile: {
                  select: {
                    instrumentsTaught: true
                  }
                }
              }
            }
          },
          orderBy: { lessonDate: "asc" }
        },
        teacherBookings: {
          include: {
            student: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { lessonDate: "asc" }
        }
      }
    })

    const bookings = user?.role === "TEACHER" ? user.teacherBookings : user?.studentBookings

    return NextResponse.json(bookings || [])
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json(
      { error: "Failed to get bookings" },
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
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        lessonDate: new Date(data.lessonDate),
        duration: data.duration,
        price: data.price,
        platformFee: Math.round(data.price * 0.05), // 5% platform fee
        status: "PENDING",
        format: data.lessonFormat,
        location: data.lessonFormat === "ONLINE" ? "Online" : null,
        notes: data.message,
        instrument: data.instrument,
      },
    })

    // Create notification for teacher
    await prisma.notification.create({
      data: {
        userId: data.teacherId,
        type: "BOOKING_REQUEST",
        title: "New Booking Request",
        content: `You have a new booking request for ${data.instrument} lesson`,
        data: { bookingId: booking.id },
      },
    })

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id 
    })
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { bookingId, action } = data

    // Get booking to verify ownership
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Only teacher can confirm/cancel, only student can cancel their own
    if (action === "CONFIRM" && booking.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (action === "CANCEL" && booking.teacherId !== session.user.id && booking.studentId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: action === "CONFIRM" ? "CONFIRMED" : "CANCELLED",
        cancelledAt: action === "CANCEL" ? new Date() : null,
        cancelledBy: action === "CANCEL" ? session.user.id : null,
      },
    })

    // Create notification
    const notifyUserId = booking.teacherId === session.user.id ? booking.studentId : booking.teacherId
    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: action === "CONFIRM" ? "BOOKING_CONFIRMED" : "BOOKING_CANCELLED",
        title: action === "CONFIRM" ? "Booking Confirmed" : "Booking Cancelled",
        content: action === "CONFIRM" 
          ? "Your booking has been confirmed by the teacher"
          : "Your booking has been cancelled",
        data: { bookingId: booking.id },
      },
    })

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    )
  }
}