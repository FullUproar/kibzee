"use client"

import { useState, useEffect, useRef } from "react"
import { formatDistanceToNow } from "@/utils/date"

interface MessagesInterfaceProps {
  conversations: any[]
  currentUserId: string
}

export default function MessagesInterface({ conversations, currentUserId }: MessagesInterfaceProps) {
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    const tempMessage = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      receiverId: selectedConversation.user.id,
      createdAt: new Date().toISOString(),
      read: false
    }

    setMessages([...messages, tempMessage])
    setNewMessage("")

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedConversation.user.id,
          content: newMessage
        })
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setMessages(prev => 
          prev.map(msg => msg.id === tempMessage.id ? sentMessage : msg)
        )
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
      setNewMessage(newMessage) // Restore message text
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="md:col-span-1 card p-4 overflow-y-auto">
        <h2 className="font-serif text-lg mb-4">Conversations</h2>
        
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No conversations yet</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.user.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-3 rounded-subtle text-left transition-colors ${
                  selectedConversation?.user.id === conv.user.id
                    ? "bg-sage/10 border border-sage"
                    : "hover:bg-dust"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conv.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.user.name || "User")}&background=7d8471&color=fff&size=40`}
                    alt={conv.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{conv.user.name}</p>
                      <span className="text-xs text-gray-500 capitalize">
                        ({conv.user.role.toLowerCase()})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(conv.lastMessage.createdAt)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="md:col-span-2 card flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.user.name || "User")}&background=7d8471&color=fff&size=40`}
                  alt={selectedConversation.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedConversation.user.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedConversation.user.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === currentUserId
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-subtle ${
                            isOwn
                              ? "bg-sage text-white"
                              : "bg-dust"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            isOwn ? "text-white/70" : "text-gray-500"
                          }`}>
                            {formatDistanceToNow(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="input flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="btn btn-primary"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  )
}