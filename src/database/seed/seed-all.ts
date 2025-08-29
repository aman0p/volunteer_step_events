import { PrismaClient } from '@/generated/prisma'
import { seedVerification } from './seed-verification'
import { seedEvents } from './seed-events'
import { seedEnrollments } from './seed-enrollments'

const prisma = new PrismaClient()

async function seedAll() {
  try {
    console.log('🚀 Starting complete database seeding...\n')

    // Step 1: Seed verification (creates users)
    console.log('📝 Step 1: Seeding users and verification requests...')
    await seedVerification()
    console.log('✅ Users and verification requests seeded\n')

    // Step 2: Seed events
    console.log('🎉 Step 2: Seeding events...')
    await seedEvents()
    console.log('✅ Events seeded\n')

    // Step 3: Seed enrollments
    console.log('👥 Step 3: Seeding enrollments...')
    await seedEnrollments()
    console.log('✅ Enrollments seeded\n')

    console.log('🎊 All seeding completed successfully!')
    console.log('\n📊 Database Summary:')
    
    // Show final counts
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    const enrollmentCount = await prisma.enrollment.count()
    const verificationCount = await prisma.verificationRequest.count()

    console.log(`   👤 Users: ${userCount}`)
    console.log(`   🎉 Events: ${eventCount}`)
    console.log(`   📝 Enrollments: ${enrollmentCount}`)
    console.log(`   ✅ Verification Requests: ${verificationCount}`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\n🎉 Complete seeding script finished successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Complete seeding script failed:', error)
      process.exit(1)
    })
}

export default seedAll
