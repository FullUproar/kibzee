"use client"

import ChatInterface from "@/components/concierge/chat-interface"
import PublicHeader from "@/components/layout/public-header"

export default function ConciergePage() {
  return (
    <div className="min-h-screen bg-dust">
      <PublicHeader currentPage="concierge" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-display-sm font-serif text-ink mb-2">
              Ask the Concierge
            </h1>
            <p className="text-gray-600">
              Not sure what to do? Chat with our AI concierge to discover events
              perfect for you.
            </p>
          </div>

          <ChatInterface />

          {/* Tips */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-dust">
              <p className="font-medium text-ink mb-1">Try asking about...</p>
              <p className="text-sm text-gray-500">
                &quot;What jazz shows are coming up?&quot;
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-dust">
              <p className="font-medium text-ink mb-1">Or get specific...</p>
              <p className="text-sm text-gray-500">
                &quot;Free events this Saturday in South Bend&quot;
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-dust">
              <p className="font-medium text-ink mb-1">Or ask for ideas...</p>
              <p className="text-sm text-gray-500">
                &quot;Recommend something for a first date&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-dust mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Kibzee. Made with love in South Bend.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
