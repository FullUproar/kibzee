import { NextRequest, NextResponse } from "next/server"
import { sendWeeklyDigests, sendDailyDigests } from "@/lib/matching/digest-service"

// This endpoint is meant to be called by a cron service (e.g., Vercel Cron, GitHub Actions)
// It should be protected with a secret token in production

export async function POST(request: NextRequest) {
  // Verify the cron secret
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { type } = body

  try {
    if (type === "weekly") {
      const results = await sendWeeklyDigests()
      return NextResponse.json({
        success: true,
        type: "weekly",
        ...results,
      })
    }

    if (type === "daily") {
      const results = await sendDailyDigests()
      return NextResponse.json({
        success: true,
        type: "daily",
        ...results,
      })
    }

    return NextResponse.json({ error: "Invalid digest type" }, { status: 400 })
  } catch (error) {
    console.error("Digest job failed:", error)
    return NextResponse.json(
      { error: "Failed to send digests" },
      { status: 500 }
    )
  }
}

// Also support GET for simple cron services that only do GET requests
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "weekly"

  try {
    if (type === "weekly") {
      const results = await sendWeeklyDigests()
      return NextResponse.json({
        success: true,
        type: "weekly",
        ...results,
      })
    }

    if (type === "daily") {
      const results = await sendDailyDigests()
      return NextResponse.json({
        success: true,
        type: "daily",
        ...results,
      })
    }

    return NextResponse.json({ error: "Invalid digest type" }, { status: 400 })
  } catch (error) {
    console.error("Digest job failed:", error)
    return NextResponse.json(
      { error: "Failed to send digests" },
      { status: 500 }
    )
  }
}
