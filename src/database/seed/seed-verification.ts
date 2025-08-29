import { PrismaClient } from '@/generated/prisma'
import bcrypt from 'bcryptjs'
import { Gender, GovId, Role } from '@/generated/prisma'

const prisma = new PrismaClient()

// ImageKit user images
// Using ImageKit CDN for optimized image delivery
const userProfileImage = "https://ik.imagekit.io/praveenlodhiofficial/users/profile/profile_nQkcdEiM1.webp?updatedAt=1756423316001"
const userGovIdImage = "https://ik.imagekit.io/praveenlodhiofficial/users/gov-id/govt-id_hTp9DNNv8.webp?updatedAt=1756423306534"

const users = [
  {
    fullName: "Priya Sharma",
    email: "priya.sharma@example.com",
    phoneNumber: "+91-9876543210",
    skills: ["Event Planning", "Communication", "Leadership"],
    address: "Mumbai, Maharashtra",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phoneNumber: "+91-9876543211",
    skills: ["Logistics", "Team Management", "Problem Solving"],
    address: "Delhi, NCR",
    gender: "MALE" as Gender,
    govIdType: "PAN_CARD" as GovId,
  },
  {
    fullName: "Anjali Patel",
    email: "anjali.patel@example.com",
    phoneNumber: "+91-9876543212",
    skills: ["Marketing", "Social Media", "Creativity"],
    address: "Ahmedabad, Gujarat",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Vikram Singh",
    email: "vikram.singh@example.com",
    phoneNumber: "+91-9876543213",
    skills: ["Technical Support", "Documentation", "Training"],
    address: "Bangalore, Karnataka",
    gender: "MALE" as Gender,
    govIdType: "DRIVING_LICENSE" as GovId,
  },
  {
    fullName: "Meera Reddy",
    email: "meera.reddy@example.com",
    phoneNumber: "+91-9876543214",
    skills: ["Healthcare", "First Aid", "Patient Care"],
    address: "Hyderabad, Telangana",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phoneNumber: "+91-9876543215",
    skills: ["Photography", "Videography", "Editing"],
    address: "Pune, Maharashtra",
    gender: "MALE" as Gender,
    govIdType: "PASSPORT" as GovId,
  },
  {
    fullName: "Kavya Iyer",
    email: "kavya.iyer@example.com",
    phoneNumber: "+91-9876543216",
    skills: ["Art & Design", "Crafting", "Workshop Facilitation"],
    address: "Chennai, Tamil Nadu",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Rahul Verma",
    email: "rahul.verma@example.com",
    phoneNumber: "+91-9876543217",
    skills: ["Sports Coaching", "Fitness Training", "Motivation"],
    address: "Kolkata, West Bengal",
    gender: "MALE" as Gender,
    govIdType: "PAN_CARD" as GovId,
  },
  {
    fullName: "Sneha Gupta",
    email: "sneha.gupta@example.com",
    phoneNumber: "+91-9876543218",
    skills: ["Childcare", "Education", "Storytelling"],
    address: "Jaipur, Rajasthan",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Aditya Joshi",
    email: "aditya.joshi@example.com",
    phoneNumber: "+91-9876543219",
    skills: ["Music", "Sound Engineering", "Performance"],
    address: "Lucknow, Uttar Pradesh",
    gender: "MALE" as Gender,
    govIdType: "DRIVING_LICENSE" as GovId,
  },
  {
    fullName: "Zara Khan",
    email: "zara.khan@example.com",
    phoneNumber: "+91-9876543220",
    skills: ["Language Teaching", "Translation", "Cultural Exchange"],
    address: "Bhopal, Madhya Pradesh",
    gender: "FEMALE" as Gender,
    govIdType: "PASSPORT" as GovId,
  },
  {
    fullName: "Dev Malhotra",
    email: "dev.malhotra@example.com",
    phoneNumber: "+91-9876543221",
    skills: ["IT Support", "Web Development", "Database Management"],
    address: "Chandigarh, Punjab",
    gender: "MALE" as Gender,
    govIdType: "PAN_CARD" as GovId,
  },
  {
    fullName: "Ishita Desai",
    email: "ishita.desai@example.com",
    phoneNumber: "+91-9876543222",
    skills: ["Environmental Awareness", "Sustainability", "Community Outreach"],
    address: "Vadodara, Gujarat",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  },
  {
    fullName: "Karan Thakur",
    email: "karan.thakur@example.com",
    phoneNumber: "+91-9876543223",
    skills: ["Emergency Response", "Disaster Management", "Safety Training"],
    address: "Dehradun, Uttarakhand",
    gender: "MALE" as Gender,
    govIdType: "DRIVING_LICENSE" as GovId,
  },
  {
    fullName: "Nisha Rao",
    email: "nisha.rao@example.com",
    phoneNumber: "+91-9876543224",
    skills: ["Nutrition", "Cooking", "Health Education"],
    address: "Mysore, Karnataka",
    gender: "FEMALE" as Gender,
    govIdType: "AADHAR_CARD" as GovId,
  }
]

export async function seedVerification() {
  console.log('🌱 Starting verification seeding...')

  try {
    // Clear existing verification requests and users (optional - comment out if you want to keep existing data)
    console.log('🧹 Cleaning up existing data...')
    await prisma.verificationRequest.deleteMany()
    await prisma.user.deleteMany({
      where: {
        email: {
          in: users.map(user => user.email)
        }
      }
    })

    console.log('👥 Creating users and verification requests...')
    
    for (const userData of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash('password123', 12)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          profileImage: userProfileImage,
          govIdImage: userGovIdImage,
          role: 'USER' as Role,
          isVerified: false,
        }
      })

      console.log(`✅ Created user: ${user.fullName} (${user.email})`)

      // Create verification request
      const verificationRequest = await prisma.verificationRequest.create({
        data: {
          userId: user.id,
          status: 'PENDING',
          submittedAt: new Date(),
        }
      })

      console.log(`📝 Created verification request for: ${user.fullName}`)
    }

    console.log('🎉 Seeding completed successfully!')
    console.log(`📊 Created ${users.length} users`)
    console.log(`📋 Created ${users.length} verification requests`)
    
    // Display summary
    const totalUsers = await prisma.user.count()
    const totalVerificationRequests = await prisma.verificationRequest.count()
    const pendingRequests = await prisma.verificationRequest.count({
      where: { status: 'PENDING' }
    })
    
    console.log('\n📈 Database Summary:')
    console.log(`Total Users: ${totalUsers}`)
    console.log(`Total Verification Requests: ${totalVerificationRequests}`)
    console.log(`Pending Requests: ${pendingRequests}`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedVerification()
    .then(() => {
      console.log('🚀 Seeding script finished')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}
