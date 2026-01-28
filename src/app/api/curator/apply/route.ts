import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user already has a curator profile
  const existingProfile = await prisma.curatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (existingProfile) {
    return NextResponse.json(
      { error: "You already have a curator application", status: existingProfile.status },
      { status: 409 }
    )
  }

  const body = await request.json()
  const { displayName, bio, expertise, website, instagram } = body

  if (!displayName || displayName.length < 2) {
    return NextResponse.json(
      { error: "Display name is required" },
      { status: 400 }
    )
  }

  if (!expertise || expertise.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one area of expertise" },
      { status: 400 }
    )
  }

  // Create curator profile with PENDING status
  const curatorProfile = await prisma.curatorProfile.create({
    data: {
      userId: session.user.id,
      displayName,
      bio: bio || null,
      expertise,
      website: website || null,
      instagram: instagram || null,
      status: "PENDING",
    },
  })

  return NextResponse.json(curatorProfile, { status: 201 })
}

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const curatorProfile = await prisma.curatorProfile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(curatorProfile)
}
