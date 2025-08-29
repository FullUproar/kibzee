import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(_req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return default preferences
    // In production, you'd store these in the database
    return NextResponse.json({
      emailBookings: true,
      emailMessages: true,
      emailReviews: true,
      emailMarketing: false,
      smsBookings: false,
      smsReminders: false,
    })
  } catch (error) {
    console.error("Get preferences error:", error)
    return NextResponse.json(
      { error: "Failed to get preferences" },
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
    
    // For now, just return success
    // In production, you'd save these preferences
    return NextResponse.json({ success: true, preferences: data })
  } catch (error) {
    console.error("Preferences update error:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}