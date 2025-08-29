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
    
    // Create teacher profile
    const teacherProfile = await prisma.teacherProfile.create({
      data: {
        userId: data.userId,
        bio: data.bio,
        yearsExperience: data.yearsExperience,
        address: data.address || null,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        instrumentsTaught: data.instrumentsTaught || [],
        teachingStyles: data.teachingStyles || [],
        ageGroups: data.ageGroups || [],
        languages: data.languages || ["English"],
        lessonDurations: data.lessonDurations || [30, 45, 60],
        trialLessonRate: data.trialLessonRate,
        weeklySchedule: data.weeklySchedule || {},
      },
    })

    // Create initial rate if provided
    if (data.hourlyRate) {
      await prisma.teacherRate.create({
        data: {
          teacherProfileId: teacherProfile.id,
          duration: 60,
          price: parseInt(data.hourlyRate) * 100,
        },
      })
    }

    // Update user status to active (pending verification)
    await prisma.user.update({
      where: { id: data.userId },
      data: { status: "PENDING_VERIFICATION" },
    })

    return NextResponse.json({ success: true, profileId: teacherProfile.id })
  } catch (error) {
    console.error("Teacher onboarding error:", error)
    return NextResponse.json(
      { error: "Failed to create teacher profile" },
      { status: 500 }
    )
  }
}