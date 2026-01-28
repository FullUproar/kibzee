import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  getConciergeResponse,
  buildConciergeContext,
  type Message,
} from "@/lib/concierge"

export async function POST(request: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id || null

  try {
    const body = await request.json()
    const { message, conversationId } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Get or create conversation (only for logged-in users)
    let conversation = null
    let history: Message[] = []

    if (userId && conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId, userId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 20, // Limit history for context window
          },
        },
      })

      if (conversation) {
        history = conversation.messages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }))
      }
    } else if (userId) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          userId,
          title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        },
      })
    }

    // Build context and get response
    const context = await buildConciergeContext(userId)
    const response = await getConciergeResponse(message, context, history)

    // Save messages (only for logged-in users)
    if (userId && conversation) {
      await prisma.conversationMessage.createMany({
        data: [
          {
            conversationId: conversation.id,
            role: "user",
            content: message,
          },
          {
            conversationId: conversation.id,
            role: "assistant",
            content: response.content,
            metadata: {
              eventsRecommended: response.eventIds,
            },
          },
        ],
      })

      // Update conversation last message time
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      })
    }

    // Fetch event details for any recommended events
    const recommendedEvents =
      response.eventIds.length > 0
        ? await prisma.event.findMany({
            where: { id: { in: response.eventIds } },
            select: {
              id: true,
              title: true,
              slug: true,
              shortDescription: true,
              category: true,
              startDate: true,
              priceMin: true,
              priceMax: true,
              isFree: true,
              imageUrl: true,
              isCuratedPick: true,
              venue: {
                select: {
                  name: true,
                  city: true,
                  slug: true,
                },
              },
            },
          })
        : []

    return NextResponse.json({
      message: response.content,
      events: recommendedEvents,
      conversationId: conversation?.id || null,
    })
  } catch (error) {
    console.error("Concierge error:", error)
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    )
  }
}

// Get conversation history
export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const conversationId = searchParams.get("conversationId")

  if (conversationId) {
    // Get specific conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId, userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(conversation)
  }

  // Get list of conversations
  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { lastMessageAt: "desc" },
    take: 20,
    select: {
      id: true,
      title: true,
      lastMessageAt: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ conversations })
}
