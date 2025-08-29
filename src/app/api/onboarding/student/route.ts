import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    
    // Create student profile
    const studentProfile = await prisma.studentProfile.create({
      data: {
        userId: data.userId,
        bio: data.bio || null,
        location: data.location || null,
        zipCode: data.zipCode || null,
        instrumentsInterest: data.instrumentsInterest || [],
        experienceLevel: data.experienceLevel,
        preferredFormat: data.preferredFormat,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        travelRadius: data.travelRadius,
        availableDays: data.availableDays || [],
        availableTimes: data.availableTimes || {},
      },
    })

    // Update user status to active
    await prisma.user.update({
      where: { id: data.userId },
      data: { status: "ACTIVE" },
    })

    return NextResponse.json({ success: true, profileId: studentProfile.id })
  } catch (error) {
    console.error("Student onboarding error:", error)
    return NextResponse.json(
      { error: "Failed to create student profile" },
      { status: 500 }
    )
  }
}