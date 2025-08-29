import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import LessonsManager from "@/components/lessons/lessons-manager"

export default async function LessonsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentBookings: {
        include: {
          teacher: {
            select: {
              name: true,
              image: true,
              teacherProfile: true
            }
          }
        },
        orderBy: { lessonDate: "asc" }
      },
      teacherBookings: {
        include: {
          student: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { lessonDate: "asc" }
      }
    }
  })

  const bookings = user?.role === "TEACHER" ? user.teacherBookings : user?.studentBookings

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif text-ink mb-8">My Lessons</h1>
      <LessonsManager 
        bookings={bookings || []}
        userRole={user?.role || "STUDENT"}
        userId={session.user.id}
      />
    </div>
  )
}