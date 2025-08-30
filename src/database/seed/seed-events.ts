import { PrismaClient } from '@/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ImageKit event cover image
// Using the actual working ImageKit URL provided
const eventCoverImage = "https://ik.imagekit.io/praveenlodhiofficial/events/covers/GettyImages-2150511667_qOTkTK4gjB.webp?updatedAt=1756216640045"

// ImageKit event video
// Using ImageKit CDN for optimized video delivery
const eventVideo = "https://ik.imagekit.io/praveenlodhiofficial/events/videos/event-video_78RaIcuDn.mp4?updatedAt=1756424686119"

const events = [
  {
    title: "Community Health Camp",
    description: "A comprehensive health checkup camp for underprivileged communities. We'll provide basic health screenings, vaccinations, and health education workshops.",
    location: "Mumbai, Maharashtra",
    startDate: new Date('2025-01-15T09:00:00Z'),
    endDate: new Date('2025-01-15T17:00:00Z'),
    dressCode: "Casual comfortable clothing with closed shoes",
    category: ["Healthcare", "Community Service", "Education"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 25
  },
  {
    title: "Environmental Cleanup Drive",
    description: "Join us for a beach cleanup initiative to protect marine life and keep our beaches clean. We'll provide all necessary equipment and refreshments.",
    location: "Juhu Beach, Mumbai",
    startDate: new Date('2025-01-20T07:00:00Z'),
    endDate: new Date('2025-01-20T12:00:00Z'),
    dressCode: "Comfortable clothes, hat, sunscreen",
    category: ["Environment", "Community Service", "Outdoor"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 40
  },
  {
    title: "Digital Literacy Workshop",
    description: "Help senior citizens learn basic computer skills, smartphone usage, and online safety. No technical expertise required, just patience and good communication skills.",
    location: "Community Center, Delhi",
    startDate: new Date('2025-01-25T10:00:00Z'),
    endDate: new Date('2025-01-25T16:00:00Z'),
    dressCode: "Smart casual",
    category: ["Education", "Technology", "Senior Care"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 15
  },
  {
    title: "Blood Donation Camp",
    description: "Emergency blood donation drive to help hospitals maintain adequate blood supply. Your donation can save multiple lives.",
    location: "City Hospital, Bangalore",
    startDate: new Date('2025-01-30T08:00:00Z'),
    endDate: new Date('2025-01-30T18:00:00Z'),
    dressCode: "Comfortable clothing with easy sleeve access",
    category: ["Healthcare", "Emergency Response", "Community Service"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 30
  },
  {
    title: "Children's Art & Craft Festival",
    description: "Creative workshop for children from low-income families. We'll provide art supplies and teach various crafting techniques.",
    location: "Public Park, Hyderabad",
    startDate: new Date('2025-02-05T14:00:00Z'),
    endDate: new Date('2025-02-05T18:00:00Z'),
    dressCode: "Clothes that can get messy, comfortable shoes",
    category: ["Arts & Culture", "Children", "Education"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 20
  },
  {
    title: "Disaster Preparedness Training",
    description: "Learn essential skills for emergency situations including first aid, evacuation procedures, and basic rescue techniques.",
    location: "Emergency Response Center, Pune",
    startDate: new Date('2025-02-10T09:00:00Z'),
    endDate: new Date('2025-02-10T17:00:00Z'),
    dressCode: "Comfortable athletic wear, closed shoes",
    category: ["Emergency Response", "Training", "Safety"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 35
  },
  {
    title: "Food Distribution Drive",
    description: "Help distribute food packets to homeless individuals and families. We'll provide warm meals and essential supplies.",
    location: "Central Station Area, Chennai",
    startDate: new Date('2025-02-15T18:00:00Z'),
    endDate: new Date('2025-02-15T22:00:00Z'),
    dressCode: "Comfortable clothing, closed shoes",
    category: ["Hunger Relief", "Community Service", "Social Work"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 25
  },
  {
    title: "Sports Coaching for Kids",
    description: "Teach basic sports skills to children from disadvantaged backgrounds. Focus on football, cricket, and athletics.",
    location: "Sports Complex, Kolkata",
    startDate: new Date('2025-02-20T06:00:00Z'),
    endDate: new Date('2025-02-20T10:00:00Z'),
    dressCode: "Sports attire, comfortable shoes",
    category: ["Sports", "Children", "Education"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 18
  },
  {
    title: "Elderly Care & Companionship",
    description: "Spend quality time with elderly residents at a senior care facility. Activities include reading, games, and conversation.",
    location: "Golden Years Senior Home, Jaipur",
    startDate: new Date('2025-02-25T15:00:00Z'),
    endDate: new Date('2025-02-25T19:00:00Z'),
    dressCode: "Comfortable, respectful clothing",
    category: ["Senior Care", "Companionship", "Social Work"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 12
  },
  {
    title: "Tree Plantation Drive",
    description: "Help plant native trees in urban areas to improve air quality and create green spaces. All equipment provided.",
    location: "City Park, Lucknow",
    startDate: new Date('2025-03-01T08:00:00Z'),
    endDate: new Date('2025-03-01T14:00:00Z'),
    dressCode: "Old clothes, gardening gloves, comfortable shoes",
    category: ["Environment", "Community Service", "Outdoor"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 45
  },
  {
    title: "Women's Self-Defense Workshop",
    description: "Empower women with basic self-defense techniques and safety awareness. Professional instructors will lead the session.",
    location: "Community Hall, Bhopal",
    startDate: new Date('2025-03-05T16:00:00Z'),
    endDate: new Date('2025-03-05T20:00:00Z'),
    dressCode: "Comfortable athletic wear, closed shoes",
    category: ["Women Empowerment", "Safety", "Training"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 30
  },
  {
    title: "Animal Shelter Support",
    description: "Help care for abandoned and injured animals at the local shelter. Tasks include feeding, cleaning, and socializing with animals.",
    location: "Pawsome Animal Shelter, Chandigarh",
    startDate: new Date('2025-03-10T09:00:00Z'),
    endDate: new Date('2025-03-10T15:00:00Z'),
    dressCode: "Old clothes, comfortable shoes, no jewelry",
    category: ["Animal Welfare", "Community Service", "Care"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 20
  },
  {
    title: "Music Therapy for Special Needs",
    description: "Use music to help children with special needs develop communication and motor skills. Musical instruments provided.",
    location: "Special Education Center, Vadodara",
    startDate: new Date('2025-03-15T10:00:00Z'),
    endDate: new Date('2025-03-15T16:00:00Z'),
    dressCode: "Comfortable, colorful clothing",
    category: ["Music", "Special Needs", "Therapy"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 15
  },
  {
    title: "Cycling for Clean Air",
    description: "Organize a cycling event to promote eco-friendly transportation and raise awareness about air pollution.",
    location: "City Center to Botanical Gardens, Dehradun",
    startDate: new Date('2025-03-20T06:00:00Z'),
    endDate: new Date('2025-03-20T12:00:00Z'),
    dressCode: "Cycling gear, helmet, comfortable shoes",
    category: ["Environment", "Sports", "Awareness"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 50
  },
  {
    title: "Nutrition & Cooking Workshop",
    description: "Teach families how to prepare healthy, affordable meals using locally available ingredients. Focus on balanced nutrition.",
    location: "Community Kitchen, Mysore",
    startDate: new Date('2025-03-25T14:00:00Z'),
    endDate: new Date('2025-03-25T18:00:00Z'),
    dressCode: "Comfortable clothing, apron provided",
    category: ["Nutrition", "Education", "Cooking"],
    coverUrl: eventCoverImage,
    videoUrl: eventVideo,
    eventImages: [eventCoverImage, eventCoverImage, eventCoverImage, eventCoverImage],
    maxVolunteers: 22
  }
]

export async function seedEvents() {
  console.log('🌱 Starting event seeding...')

  try {
    // Clear existing data (enrollments first due to foreign key constraints)
    console.log('🧹 Cleaning up existing data...')
    await prisma.enrollment.deleteMany()
    await prisma.event.deleteMany()

    console.log('🎉 Creating events...')
    
    // Ensure we have at least one user to associate as the creator/owner of events
    let creators = await prisma.user.findMany({})
    if (creators.length === 0) {
      console.log('👤 No users found. Creating a default event creator user...')
      const hashedPassword = await bcrypt.hash('password123', 12)
      const defaultUser = await prisma.user.create({
        data: {
          fullName: 'Default Organizer',
          email: 'organizer@example.com',
          phoneNumber: '+91-9000000000',
          skills: ['Organizing', 'Planning'],
          address: 'Default City',
          gender: 'OTHER',
          govIdType: 'AADHAR_CARD',
          password: hashedPassword,
          profileImage: 'https://ik.imagekit.io/praveenlodhiofficial/users/profile/profile_nQkcdEiM1.webp?updatedAt=1756423316001',
          govIdImage: 'https://ik.imagekit.io/praveenlodhiofficial/users/gov-id/govt-id_hTp9DNNv8.webp?updatedAt=1756423306534',
          role: 'USER',
          isVerified: false,
        }
      })
      creators = [defaultUser]
    }

    for (const eventData of events) {
      const creator = creators[events.indexOf(eventData) % creators.length]
      const event = await prisma.event.create({
        data: {
          ...eventData,
          createdBy: {
            connect: { id: creator.id }
          }
        }
      })

      console.log(`✅ Created event: ${event.title} (${event.location})`)
    }

    console.log('🎉 Event seeding completed successfully!')
    console.log(`📊 Created ${events.length} events`)
    
    // Display summary
    const totalEvents = await prisma.event.count()
    const upcomingEvents = await prisma.event.count({
      where: { 
        startDate: { 
          gte: new Date() 
        } 
      }
    })
    
    console.log('\n📈 Database Summary:')
    console.log(`Total Events: ${totalEvents}`)
    console.log(`Upcoming Events: ${upcomingEvents}`)

  } catch (error) {
    console.error('❌ Error during event seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedEvents()
    .then(() => {
      console.log('🚀 Event seeding script finished')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Event seeding failed:', error)
      process.exit(1)
    })
}
