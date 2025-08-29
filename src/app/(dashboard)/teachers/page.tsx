import { Suspense } from "react"
import TeacherSearch from "@/components/teachers/teacher-search"
import TeacherList from "@/components/teachers/teacher-list"
import { prisma } from "@/lib/prisma"

interface SearchParams {
  instrument?: string
  location?: string
  format?: string
  priceMin?: string
  priceMax?: string
  sort?: string
}

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Build query based on search params
  const where: any = {
    user: {
      status: "ACTIVE",
      role: "TEACHER",
    },
    identityVerified: true,
  }

  if (searchParams.instrument) {
    where.instrumentsTaught = {
      has: searchParams.instrument,
    }
  }

  if (searchParams.location) {
    where.OR = [
      { city: { contains: searchParams.location, mode: "insensitive" } },
      { zipCode: { contains: searchParams.location, mode: "insensitive" } },
    ]
  }

  // Get teachers with filters
  const teachers = await prisma.teacherProfile.findMany({
    where,
    include: {
      user: {
        include: {
          reviewsReceived: {
            select: {
              rating: true,
            },
          },
        },
      },
      rates: true,
    },
    take: 20,
  })

  // Calculate average ratings
  const teachersWithRatings = teachers.map((teacher) => {
    const reviews = teacher.user.reviewsReceived
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0
    
    const lowestRate = teacher.rates.length > 0
      ? Math.min(...teacher.rates.map(r => r.price))
      : 0

    return {
      ...teacher,
      averageRating,
      reviewCount: reviews.length,
      lowestRate,
    }
  })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-ink mb-2">Find Your Perfect Teacher</h1>
          <p className="text-gray-600">
            Browse verified music instructors in your area
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TeacherSearch />
          </div>
          
          <div className="lg:col-span-3">
            <Suspense fallback={<TeacherListSkeleton />}>
              <TeacherList teachers={teachersWithRatings} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function TeacherListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}