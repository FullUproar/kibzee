import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Get student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!studentProfile) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      )
    }

    // Update student profile
    await prisma.studentProfile.update({
      where: { id: studentProfile.id },
      data: {
        bio: data.bio,
        location: data.location,
        zipCode: data.zipCode,
        instrumentsInterest: data.instrumentsInterest,
        experienceLevel: data.experienceLevel,
        preferredFormat: data.preferredFormat,
        budgetMin: data.budgetMin ? data.budgetMin * 100 : null,
        budgetMax: data.budgetMax ? data.budgetMax * 100 : null,
        travelRadius: data.travelRadius,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Student settings update error:", error)
    return NextResponse.json(
      { error: "Failed to update student settings" },
      { status: 500 }
    )
  }
}