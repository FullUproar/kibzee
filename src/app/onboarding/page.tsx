import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StudentOnboarding from "@/components/onboarding/student-onboarding"
import TeacherOnboarding from "@/components/onboarding/teacher-onboarding"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  })

  if (!user) {
    redirect("/login")
  }

  // If profile already exists, redirect to dashboard
  if (user.role === "STUDENT" && user.studentProfile) {
    redirect("/dashboard")
  }
  if (user.role === "TEACHER" && user.teacherProfile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-paper py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-ink mb-2">
            Welcome to Kibzee!
          </h1>
          <p className="text-gray-600">
            Let's set up your profile to get started
          </p>
        </div>

        {user.role === "TEACHER" ? (
          <TeacherOnboarding userId={user.id} />
        ) : (
          <StudentOnboarding userId={user.id} />
        )}
      </div>
    </div>
  )
}