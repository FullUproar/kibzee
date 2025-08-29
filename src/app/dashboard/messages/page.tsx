import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MessagesInterface from "@/components/messages/messages-interface"

export default async function MessagesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  // Get conversations
  const conversations = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id }
      ]
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true
        }
      },
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          role: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Group messages by conversation
  const conversationMap = new Map()
  
  conversations.forEach(message => {
    const otherUser = message.senderId === session.user.id ? message.receiver : message.sender
    const key = otherUser.id
    
    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        user: otherUser,
        messages: [],
        lastMessage: message
      })
    }
    
    conversationMap.get(key).messages.push(message)
  })

  const conversationList = Array.from(conversationMap.values())

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif text-ink mb-8">Messages</h1>
      <MessagesInterface 
        conversations={conversationList}
        currentUserId={session.user.id}
      />
    </div>
  )
}