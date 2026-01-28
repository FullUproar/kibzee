import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  const curators = await prisma.curatorProfile.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "SUSPENDED" | "REVOKED" } : {},
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ curators })
}

export async function PATCH(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user is admin
  const adminUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const { curatorId, action } = body

  if (!curatorId || !action) {
    return NextResponse.json(
      { error: "Curator ID and action are required" },
      { status: 400 }
    )
  }

  const curatorProfile = await prisma.curatorProfile.findUnique({
    where: { id: curatorId },
    include: { user: true },
  })

  if (!curatorProfile) {
    return NextResponse.json({ error: "Curator not found" }, { status: 404 })
  }

  if (action === "approve") {
    // Update curator profile
    await prisma.curatorProfile.update({
      where: { id: curatorId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy: session.user.id,
      },
    })

    // Update user role to COMMUNITY_CURATOR
    await prisma.user.update({
      where: { id: curatorProfile.userId },
      data: { role: "COMMUNITY_CURATOR" },
    })

    return NextResponse.json({ success: true, status: "APPROVED" })
  }

  if (action === "reject" || action === "revoke") {
    await prisma.curatorProfile.update({
      where: { id: curatorId },
      data: { status: "REVOKED" },
    })

    // Reset user role to USER if they were a community curator
    if (curatorProfile.user.role === "COMMUNITY_CURATOR") {
      await prisma.user.update({
        where: { id: curatorProfile.userId },
        data: { role: "USER" },
      })
    }

    return NextResponse.json({ success: true, status: "REVOKED" })
  }

  if (action === "suspend") {
    await prisma.curatorProfile.update({
      where: { id: curatorId },
      data: { status: "SUSPENDED" },
    })

    return NextResponse.json({ success: true, status: "SUSPENDED" })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
