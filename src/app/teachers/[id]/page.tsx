import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import TeacherProfile from "@/components/teachers/teacher-profile"

interface TeacherPageProps {
  params: {
    id: string
  }
}

export default async function TeacherPage({ params }: TeacherPageProps) {
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
      },
      reviewsReceived: {
        include: {
          author: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  })

  if (!teacher || !teacher.teacherProfile) {
    notFound()
  }

  return <TeacherProfile teacher={teacher} />
}