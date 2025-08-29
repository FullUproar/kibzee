import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StudentDashboard from "@/components/dashboard/student-dashboard"
import TeacherDashboard from "@/components/dashboard/teacher-dashboard"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      teacherProfile: true,
      studentBookings: {
        take: 5,
        orderBy: { lessonDate: "desc" },
        include: {
          teacher: {
            include: {
              teacherProfile: true,
            },
          },
        },
      },
      teacherBookings: {
        take: 5,
        orderBy: { lessonDate: "desc" },
        include: {
          student: {
            include: {
              studentProfile: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Redirect to onboarding if profile is incomplete
  if (user.role === "STUDENT" && !user.studentProfile) {
    redirect("/onboarding")
  }
  if (user.role === "TEACHER" && !user.teacherProfile) {
    redirect("/onboarding")
  }

  return (
    <div className="p-6">
      {user.role === "TEACHER" ? (
        <TeacherDashboard user={user} />
      ) : (
        <StudentDashboard user={user} />
      )}
    </div>
  )
}