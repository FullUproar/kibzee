"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Sparkles } from "lucide-react"
import ChatMessage from "./chat-message"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  events?: Array<{
    id: string
    title: string
    slug: string
    shortDescription: string | null
    category: string
    startDate: string
    priceMin: number | null
    priceMax: number | null
    isFree: boolean
    imageUrl: string | null
    isCuratedPick: boolean
    venue: {
      name: string
      city: string
      slug: string
    }
  }>
}

const SUGGESTED_PROMPTS = [
  "What's happening this weekend?",
  "I'm in the mood for live music",
  "Any free events coming up?",
  "Recommend something for a date night",
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e?: React.FormEvent, promptOverride?: string) => {
    e?.preventDefault()
    const messageText = promptOverride || input.trim()

    if (!messageText || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          conversationId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          events: data.events,
        }
        setMessages((prev) => [...prev, assistantMessage])

        if (data.conversationId) {
          setConversationId(data.conversationId)
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm sorry, I'm having trouble right now. Please try again in a moment.",
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm sorry, something went wrong. Please check your connection and try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestedPrompt = (prompt: string) => {
    handleSubmit(undefined, prompt)
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-paper rounded-lg border border-dust overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-dust bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-clay/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-clay" />
          </div>
          <div>
            <h2 className="font-serif text-lg text-ink">Kibzee Concierge</h2>
            <p className="text-sm text-gray-500">
              Your guide to Michiana arts & culture
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-clay/20 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-clay" />
            </div>
            <h3 className="text-xl font-serif text-ink mb-2">
              Hey there! How can I help?
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              I know all about concerts, theater, gallery openings, and more
              happening in the Michiana area. Ask me anything!
            </p>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-4 py-2 bg-white border border-dust rounded-full text-sm text-gray-600 hover:border-sage hover:text-sage transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                events={message.events}
              />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-clay/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-clay" />
                </div>
                <div className="bg-white border border-dust rounded-lg rounded-bl-none p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dust bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about events, venues, or what to do this weekend..."
            className="flex-1 resize-none rounded-lg border border-dust px-4 py-3 focus:border-sage focus:ring-1 focus:ring-sage outline-none"
            rows={1}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-sage text-white rounded-lg hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Powered by Claude. Recommendations based on current event listings.
        </p>
      </div>
    </div>
  )
}
