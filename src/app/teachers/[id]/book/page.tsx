import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import BookingForm from "@/components/booking/booking-form"

interface BookingPageProps {
  params: {
    id: string
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-dust flex items-center justify-center">
        <div className="card p-8 max-w-md">
          <h2 className="text-xl font-serif mb-4">Sign in Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to book a lesson with this teacher.
          </p>
          <a href="/login" className="btn btn-primary w-full text-center">
            Sign In
          </a>
        </div>
      </div>
    )
  }

  const teacher = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: "TEACHER"
    },
    include: {
      teacherProfile: {
        include: {
          rates: {
            orderBy: { duration: "asc" }
          }
        }
      }
    }
  })

  if (!teacher || !teacher.teacherProfile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-dust">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BookingForm teacher={teacher} student={session.user} />
      </div>
    </div>
  )
}