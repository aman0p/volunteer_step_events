import { PrismaClient } from '@/generated/prisma'
import { Status } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function seedEnrollments() {
  try {
    console.log('🌱 Starting enrollment request seeding...')

    // Get all users (volunteers)
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['USER', 'VOLUNTEER']
        }
      },
      select: {
        id: true
      }
    })

    if (users.length === 0) {
      console.log('❌ No users found. Please run user seeding first.')
      return
    }

    // Get all events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        maxVolunteers: true
      }
    })

    if (events.length === 0) {
      console.log('❌ No events found. Please run event seeding first.')
      return
    }

    console.log(`📊 Found ${users.length} users and ${events.length} events`)

    // Clear existing enrollments
    await prisma.enrollment.deleteMany({})
    console.log('🧹 Cleared existing enrollments')

    const enrollments = []
    const statuses: Status[] = ['PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED']

    // Create random enrollments
    for (const user of users) {
      // Each user enrolls in 1-3 random events
      const numEnrollments = Math.floor(Math.random() * 3) + 1
      const selectedEvents = getRandomEvents(events, numEnrollments)

      for (const event of selectedEvents) {
        const status = getRandomStatus(statuses)
        const enrolledAt = getRandomDate()

        enrollments.push({
          userId: user.id,
          eventId: event.id,
          status,
          enrolledAt
        })
      }
    }

    // Insert enrollments
    const createdEnrollments = await prisma.enrollment.createMany({
      data: enrollments
    })

    console.log(`✅ Successfully created ${createdEnrollments.count} enrollments`)

    // Log some statistics
    const statusCounts = await prisma.enrollment.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    })

    console.log('📈 Enrollment Status Distribution:')
    statusCounts.forEach(({ status, _count }) => {
      console.log(`   ${status}: ${_count.status}`)
    })

    // Check event capacity
    console.log('\n🎯 Event Capacity Check:')
    for (const event of events) {
      const approvedCount = await prisma.enrollment.count({
        where: {
          eventId: event.id,
          status: 'APPROVED'
        }
      })

      const maxVolunteers = event.maxVolunteers || 'Unlimited'
      console.log(`   Event ${event.id}: ${approvedCount}/${maxVolunteers} volunteers`)
    }

    console.log('\n🎉 Enrollment seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding enrollments:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

function getRandomEvents(events: any[], count: number) {
  const shuffled = [...events].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomStatus(statuses: Status[]): Status {
  // Weight the statuses - prioritize PENDING for admin review
  const weights: Record<Status, number> = {
    'PENDING': 0.7,      // 70% - Most enrollments should be pending for admin review
    'APPROVED': 0.2,     // 20% - Some already approved
    'REJECTED': 0.08,    // 8% - Few rejections
    'WAITLISTED': 0.02,  // 2% - Very few waitlisted
    'CANCELLED': 0        // 0% - No cancelled enrollments in seeding
  }

  const random = Math.random()
  let cumulative = 0

  for (const status of statuses) {
    cumulative += weights[status]
    if (random <= cumulative) {
      return status
    }
  }

  return 'PENDING' // fallback
}

function getRandomDate(): Date {
  // Generate dates within the last 30 days
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))
  
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  return new Date(randomTime)
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedEnrollments()
    .then(() => {
      console.log('✅ Enrollment seeding script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Enrollment seeding script failed:', error)
      process.exit(1)
    })
}

