import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      // Get all conversations
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: session.user.id },
            { receiverId: session.user.id }
          ]
        },
        include: {
          sender: true,
          receiver: true
        },
        orderBy: { createdAt: "desc" }
      })

      return NextResponse.json(messages)
    }

    // Get messages for specific conversation
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: userId },
          { senderId: userId, receiverId: session.user.id }
        ]
      },
      orderBy: { createdAt: "asc" }
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: userId,
        receiverId: session.user.id,
        read: false
      },
      data: { read: true }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json(
      { error: "Failed to get messages" },
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
    
    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: data.receiverId,
        content: data.content,
        read: false
      }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: data.receiverId,
        type: "NEW_MESSAGE",
        title: "New Message",
        content: `You have a new message`,
        data: { messageId: message.id }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}