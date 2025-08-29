import { redirect } from "next/navigation"
import DashboardNav from "@/components/layout/dashboard-nav"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Get user details from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      image: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <DashboardNav
        userRole={user.role}
        userName={user.name}
        userImage={user.image}
      />
      <main className="flex-1 md:ml-64">
        <div className="pt-16 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  )
}