import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/admin-dashboard"
import { prisma } from "@/lib/prisma"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Get dashboard statistics for events platform
  const [
    totalUsers,
    totalCurators,
    pendingCuratorsCount,
    totalEvents,
    publishedEvents,
    pendingEventsCount,
    totalVenues,
    totalArtists,
    recentEvents,
    recentUsers,
    pendingCuratorsList,
    pendingEventsList
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: { in: ['FOUNDER_CURATOR', 'COMMUNITY_CURATOR'] }
      }
    }),
    prisma.curatorProfile.count({ where: { status: 'PENDING' } }),
    prisma.event.count(),
    prisma.event.count({ where: { status: 'PUBLISHED' } }),
    prisma.event.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.venue.count(),
    prisma.artist.count(),
    prisma.event.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        venue: true,
        curator: { select: { name: true, email: true } },
      }
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.curatorProfile.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.event.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: {
        venue: { select: { name: true, city: true } },
        curator: {
          select: {
            id: true,
            name: true,
            email: true,
            curatorProfile: { select: { displayName: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  const stats = {
    totalUsers,
    totalCurators,
    pendingCurators: pendingCuratorsCount,
    totalEvents,
    publishedEvents,
    pendingEvents: pendingEventsCount,
    totalVenues,
    totalArtists,
    recentEvents,
    recentUsers,
    pendingCuratorsList,
    pendingEventsList
  }

  return <AdminDashboard stats={stats} />
}
