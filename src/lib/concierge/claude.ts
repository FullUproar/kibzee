import Anthropic from "@anthropic-ai/sdk"
import { buildSystemPrompt } from "./prompts"
import { buildEventContext, type ConciergeContext } from "./context"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface Message {
  role: "user" | "assistant"
  content: string
}

export interface ConciergeResponse {
  content: string
  eventIds: string[]
}

export async function getConciergeResponse(
  userMessage: string,
  context: ConciergeContext,
  conversationHistory: Message[] = []
): Promise<ConciergeResponse> {
  const systemPrompt = buildSystemPrompt(context)
  const eventContext = buildEventContext(context.events)

  const messages: Anthropic.MessageParam[] = [
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    {
      role: "user" as const,
      content: `${userMessage}\n\n${eventContext}`,
    },
  ]

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  const contentBlock = response.content[0]
  const responseText = contentBlock.type === "text" ? contentBlock.text : ""

  // Extract event IDs mentioned in the response
  const eventIds = extractEventIds(responseText, context.events)

  return {
    content: responseText,
    eventIds,
  }
}

function extractEventIds(
  response: string,
  events: ConciergeContext["events"]
): string[] {
  const mentionedIds: string[] = []

  for (const event of events) {
    // Check if the event title or a significant part of it is mentioned
    const titleWords = event.title.toLowerCase().split(" ")
    const responseLower = response.toLowerCase()

    // If at least 2 significant words from the title appear near each other
    const significantWords = titleWords.filter((w) => w.length > 3)
    const matchCount = significantWords.filter((word) =>
      responseLower.includes(word)
    ).length

    if (matchCount >= Math.min(2, significantWords.length)) {
      mentionedIds.push(event.id)
    }
  }

  return mentionedIds
}
