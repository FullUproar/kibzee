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
    const { section, ...updateData } = data

    // Get teacher profile
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      )
    }

    // Update based on section
    switch (section) {
      case "profile":
        await prisma.teacherProfile.update({
          where: { id: teacherProfile.id },
          data: {
            bio: updateData.bio,
            yearsExperience: updateData.yearsExperience,
            instrumentsTaught: updateData.instrumentsTaught,
            teachingStyles: updateData.teachingStyles,
            ageGroups: updateData.ageGroups,
            languages: updateData.languages,
          },
        })
        break

      case "availability":
        await prisma.teacherProfile.update({
          where: { id: teacherProfile.id },
          data: {
            weeklySchedule: updateData.weeklySchedule,
          },
        })
        break

      case "rates":
        // Delete existing rates
        await prisma.teacherRate.deleteMany({
          where: { teacherProfileId: teacherProfile.id },
        })
        
        // Create new rates
        if (updateData.rates && updateData.rates.length > 0) {
          await prisma.teacherRate.createMany({
            data: updateData.rates.map((rate: any) => ({
              teacherProfileId: teacherProfile.id,
              duration: rate.duration,
              price: rate.price * 100, // Convert to cents
              description: rate.description,
            })),
          })
        }
        break

      default:
        return NextResponse.json(
          { error: "Invalid section" },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Teacher settings update error:", error)
    return NextResponse.json(
      { error: "Failed to update teacher settings" },
      { status: 500 }
    )
  }
}