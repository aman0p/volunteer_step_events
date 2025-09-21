import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// ImageKit event cover image
// Using the actual working ImageKit URL provided
const eventCoverImage =
   "https://ik.imagekit.io/volunteer/events/covers/133786265187991478_nd-24RZC8.jpg?updatedAt=1756627591738";

// ImageKit event video
// Using ImageKit CDN for optimized video delivery
const eventVideo =
   "https://ik.imagekit.io/praveenlodhiofficial/events/videos/event-video_78RaIcuDn.mp4?updatedAt=1756424686119";

const events = [
   {
      title: "Community Health Camp",
      description:
         "A comprehensive health checkup camp for underprivileged communities. We'll provide basic health screenings, vaccinations, and health education workshops.",
      location: "Mumbai, Maharashtra",
      startDate: new Date("2026-01-15T09:00:00Z"),
      endDate: new Date("2026-01-15T17:00:00Z"),
      dressCode: "Casual comfortable clothing with closed shoes",
      category: ["Healthcare", "Community Service", "Education"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 25,
      eventRoles: [
         {
            name: "Medical Assistant",
            description: "Assist doctors with patient checkups, maintain records, and help with basic medical procedures. Prior medical knowledge preferred but not required.",
            payout: 1500,
            maxCount: 8,
         },
         {
            name: "Registration Coordinator",
            description: "Manage patient registration, collect basic information, and maintain organized flow of patients through the camp.",
            payout: 800,
            maxCount: 4,
         },
         {
            name: "Health Educator",
            description: "Conduct health awareness sessions, distribute educational materials, and answer basic health questions from community members.",
            payout: 1200,
            maxCount: 6,
         },
         {
            name: "Logistics Support",
            description: "Help with setup, equipment management, crowd control, and ensure smooth operations throughout the event.",
            payout: 600,
            maxCount: 7,
         },
      ],
      quickLinks: [
         {
            title: "Health Guidelines",
            url: "https://www.who.int/health-topics/primary-health-care",
            isActive: true,
         },
         {
            title: "Event Schedule",
            url: "https://example.com/health-camp-schedule",
            isActive: true,
         },
         {
            title: "Medical Forms",
            url: "https://example.com/medical-forms",
            isActive: true,
         },
      ],
   },
   {
      title: "Environmental Cleanup Drive",
      description:
         "Join us for a beach cleanup initiative to protect marine life and keep our beaches clean. We'll provide all necessary equipment and refreshments.",
      location: "Juhu Beach, Mumbai",
      startDate: new Date("2026-01-20T07:00:00Z"),
      endDate: new Date("2026-01-20T12:00:00Z"),
      dressCode: "Comfortable clothes, hat, sunscreen",
      category: ["Environment", "Community Service", "Outdoor"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 40,
      eventRoles: [
         {
            name: "Cleanup Coordinator",
            description: "Lead cleanup activities, coordinate teams, and ensure proper waste segregation. Experience in environmental work preferred.",
            payout: 2000,
            maxCount: 3,
         },
         {
            name: "Beach Cleaner",
            description: "Collect and segregate waste from beach areas, work in teams to cover assigned zones efficiently.",
            payout: 800,
            maxCount: 25,
         },
         {
            name: "Safety Monitor",
            description: "Ensure volunteer safety, monitor weather conditions, and provide first aid if needed. Basic first aid certification required.",
            payout: 1500,
            maxCount: 4,
         },
         {
            name: "Data Recorder",
            description: "Record cleanup data, take photos for documentation, and maintain records of collected waste quantities.",
            payout: 1000,
            maxCount: 3,
         },
         {
            name: "Equipment Manager",
            description: "Distribute and maintain cleanup equipment, ensure proper storage, and manage supplies throughout the event.",
            payout: 1200,
            maxCount: 5,
         },
      ],
      quickLinks: [
         {
            title: "Cleanup Guidelines",
            url: "https://www.unep.org/beat-plastic-pollution",
            isActive: true,
         },
         {
            title: "Safety Protocol",
            url: "https://example.com/cleanup-safety",
            isActive: true,
         },
         {
            title: "Waste Segregation Guide",
            url: "https://example.com/waste-segregation",
            isActive: true,
         },
      ],
   },
   {
      title: "Digital Literacy Workshop",
      description: `Join us for an interactive and hands-on Digital Literacy Workshop designed specifically for senior citizens who want to gain confidence in using technology in their everyday lives. 
    This workshop will cover essential computer skills, such as using a keyboard and mouse, navigating desktop and smartphone interfaces, setting up email accounts, and managing important files. 
    Participants will also learn how to safely browse the internet, identify online scams, use social media platforms to stay connected with loved ones, and explore useful apps for health, communication, and entertainment.
    
    Our goal is to make technology fun, simple, and approachable. No prior technical experience is required — only a willingness to learn! Volunteers will work closely with attendees, providing one-on-one support to ensure every participant feels comfortable and empowered throughout the session.
    
    By the end of this workshop, participants will have the skills to:
    - Send and receive emails with confidence.
    - Safely browse the internet and recognize potential online threats.
    - Use video calling tools like WhatsApp and Zoom to stay in touch with family and friends.
    - Manage smartphone settings and install helpful apps.
    - Gain independence and reduce reliance on others for basic digital tasks.
    
    If you are a patient, empathetic communicator who enjoys helping others, this is a perfect opportunity to make a real impact. Come be part of a meaningful initiative to bridge the digital divide and give our senior community the gift of confidence in the digital age.`,
      location: "Community Center, Delhi",
      startDate: new Date("2026-01-25T10:00:00Z"),
      endDate: new Date("2026-01-25T16:00:00Z"),
      dressCode: "Smart casual",
      category: ["Education", "Technology", "Senior Care"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 15,
      eventRoles: [
         {
            name: "Workshop Instructor",
            description: "Lead digital literacy sessions, teach basic computer and smartphone skills to senior citizens. Patience and clear communication essential.",
            payout: 2500,
            maxCount: 2,
         },
         {
            name: "One-on-One Assistant",
            description: "Provide individual support to participants, help them practice skills, and ensure everyone can follow along with the lessons.",
            payout: 1200,
            maxCount: 8,
         },
         {
            name: "Technical Support",
            description: "Troubleshoot technical issues, set up devices, and ensure all equipment works properly throughout the workshop.",
            payout: 1500,
            maxCount: 3,
         },
         {
            name: "Registration Helper",
            description: "Assist with participant check-in, distribute materials, and help with any administrative tasks during the event.",
            payout: 800,
            maxCount: 2,
         },
      ],
      quickLinks: [
         {
            title: "Digital Safety Guide",
            url: "https://www.cyber.gov.au/acsc/view-all-content/advice/seniors",
            isActive: true,
         },
         {
            title: "Workshop Materials",
            url: "https://example.com/digital-literacy-materials",
            isActive: true,
         },
         {
            title: "Practice Resources",
            url: "https://example.com/practice-exercises",
            isActive: true,
         },
      ],
   },
   {
      title: "Blood Donation Camp",
      description:
         "Emergency blood donation drive to help hospitals maintain adequate blood supply. Your donation can save multiple lives.",
      location: "City Hospital, Bangalore",
      startDate: new Date("2026-01-30T08:00:00Z"),
      endDate: new Date("2026-01-30T18:00:00Z"),
      dressCode: "Comfortable clothing with easy sleeve access",
      category: ["Healthcare", "Emergency Response", "Community Service"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 30,
      eventRoles: [
         {
            name: "Medical Technician",
            description: "Assist with blood collection, pre-donation screening, and post-donation care. Medical background preferred.",
            payout: 2000,
            maxCount: 4,
         },
         {
            name: "Registration Coordinator",
            description: "Manage donor registration, verify eligibility, and maintain donor records throughout the camp.",
            payout: 1000,
            maxCount: 3,
         },
         {
            name: "Donor Care Assistant",
            description: "Provide refreshments, monitor donor recovery, and ensure donor comfort after donation.",
            payout: 800,
            maxCount: 6,
         },
         {
            name: "Logistics Coordinator",
            description: "Manage blood storage, transportation, and ensure proper handling of collected blood units.",
            payout: 1500,
            maxCount: 2,
         },
         {
            name: "Crowd Manager",
            description: "Maintain orderly flow of donors, manage waiting areas, and ensure smooth operations.",
            payout: 700,
            maxCount: 8,
         },
         {
            name: "Health Counselor",
            description: "Provide pre-donation counseling, answer health questions, and educate donors about blood donation.",
            payout: 1200,
            maxCount: 4,
         },
         {
            name: "Data Entry Specialist",
            description: "Record donor information, maintain digital records, and ensure data accuracy.",
            payout: 900,
            maxCount: 3,
         },
      ],
      quickLinks: [
         {
            title: "Donation Guidelines",
            url: "https://www.redcross.org/give-blood",
            isActive: true,
         },
         {
            title: "Eligibility Criteria",
            url: "https://example.com/blood-donation-eligibility",
            isActive: true,
         },
         {
            title: "Health Check Form",
            url: "https://example.com/health-check-form",
            isActive: true,
         },
      ],
   },
   {
      title: "Children's Art & Craft Festival",
      description:
         "Creative workshop for children from low-income families. We'll provide art supplies and teach various crafting techniques.",
      location: "Public Park, Hyderabad",
      startDate: new Date("2026-02-05T14:00:00Z"),
      endDate: new Date("2026-02-05T18:00:00Z"),
      dressCode: "Clothes that can get messy, comfortable shoes",
      category: ["Arts & Culture", "Children", "Education"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 20,
      eventRoles: [
         {
            name: "Art Instructor",
            description: "Teach various art and craft techniques to children, guide creative activities, and inspire artistic expression.",
            payout: 1800,
            maxCount: 3,
         },
         {
            name: "Child Care Assistant",
            description: "Supervise children during activities, ensure safety, and provide individual attention to participants.",
            payout: 1000,
            maxCount: 8,
         },
         {
            name: "Materials Manager",
            description: "Distribute art supplies, maintain inventory, and ensure all children have necessary materials.",
            payout: 800,
            maxCount: 2,
         },
         {
            name: "Event Photographer",
            description: "Capture memorable moments, document children's artwork, and create lasting memories of the event.",
            payout: 1200,
            maxCount: 2,
         },
         {
            name: "Setup Coordinator",
            description: "Arrange workstations, prepare materials, and ensure the venue is ready for creative activities.",
            payout: 700,
            maxCount: 3,
         },
         {
            name: "Parent Liaison",
            description: "Communicate with parents, provide updates on children's progress, and handle any concerns.",
            payout: 900,
            maxCount: 2,
         },
      ],
      quickLinks: [
         {
            title: "Art Supplies List",
            url: "https://example.com/art-supplies",
            isActive: true,
         },
         {
            title: "Safety Guidelines",
            url: "https://example.com/children-safety",
            isActive: true,
         },
         {
            title: "Activity Schedule",
            url: "https://example.com/art-festival-schedule",
            isActive: true,
         },
      ],
   },
   {
      title: "Disaster Preparedness Training",
      description:
         "Learn essential skills for emergency situations including first aid, evacuation procedures, and basic rescue techniques.",
      location: "Emergency Response Center, Pune",
      startDate: new Date("2026-02-10T09:00:00Z"),
      endDate: new Date("2026-02-10T17:00:00Z"),
      dressCode: "Comfortable athletic wear, closed shoes",
      category: ["Emergency Response", "Training", "Safety"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 35,
      eventRoles: [
         {
            name: "Training Instructor",
            description: "Lead disaster preparedness training sessions, teach first aid and emergency response techniques. Medical or emergency services background required.",
            payout: 3000,
            maxCount: 2,
         },
         {
            name: "First Aid Assistant",
            description: "Assist with first aid demonstrations, help participants practice techniques, and provide hands-on guidance.",
            payout: 1500,
            maxCount: 4,
         },
         {
            name: "Equipment Specialist",
            description: "Manage training equipment, demonstrate proper use of emergency tools, and ensure equipment safety.",
            payout: 1200,
            maxCount: 3,
         },
         {
            name: "Scenario Coordinator",
            description: "Organize practice scenarios, simulate emergency situations, and guide participants through realistic training exercises.",
            payout: 1800,
            maxCount: 3,
         },
         {
            name: "Safety Monitor",
            description: "Ensure participant safety during training, monitor for any risks, and provide immediate assistance if needed.",
            payout: 1000,
            maxCount: 4,
         },
         {
            name: "Registration Assistant",
            description: "Handle participant check-in, distribute materials, and manage training documentation.",
            payout: 800,
            maxCount: 3,
         },
         {
            name: "Logistics Coordinator",
            description: "Manage venue setup, coordinate refreshments, and ensure smooth operation of all training activities.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Documentation Specialist",
            description: "Record training progress, maintain participant records, and prepare certificates of completion.",
            payout: 900,
            maxCount: 2,
         },
         {
            name: "Group Facilitator",
            description: "Lead small group activities, facilitate discussions, and ensure all participants are engaged in learning.",
            payout: 1100,
            maxCount: 6,
         },
         {
            name: "Emergency Contact",
            description: "Serve as emergency contact point, coordinate with local emergency services, and manage any real emergencies.",
            payout: 1500,
            maxCount: 2,
         },
      ],
      quickLinks: [
         {
            title: "Training Manual",
            url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies",
            isActive: true,
         },
         {
            title: "First Aid Guide",
            url: "https://example.com/first-aid-guide",
            isActive: true,
         },
         {
            title: "Emergency Contacts",
            url: "https://example.com/emergency-contacts",
            isActive: true,
         },
      ],
   },
   {
      title: "Food Distribution Drive",
      description:
         "Help distribute food packets to homeless individuals and families. We'll provide warm meals and essential supplies.",
      location: "Central Station Area, Chennai",
      startDate: new Date("2026-02-15T18:00:00Z"),
      endDate: new Date("2026-02-15T22:00:00Z"),
      dressCode: "Comfortable clothing, closed shoes",
      category: ["Hunger Relief", "Community Service", "Social Work"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 25,
      eventRoles: [
         {
            name: "Distribution Coordinator",
            description: "Lead food distribution activities, coordinate teams, and ensure efficient distribution to all areas.",
            payout: 2000,
            maxCount: 2,
         },
         {
            name: "Food Server",
            description: "Serve meals to beneficiaries, maintain hygiene standards, and ensure everyone receives adequate portions.",
            payout: 1000,
            maxCount: 8,
         },
         {
            name: "Crowd Manager",
            description: "Maintain orderly distribution lines, ensure safety, and manage crowd flow during the event.",
            payout: 800,
            maxCount: 4,
         },
         {
            name: "Logistics Assistant",
            description: "Help with food preparation, packaging, and transportation of supplies to distribution points.",
            payout: 900,
            maxCount: 3,
         },
         {
            name: "Community Liaison",
            description: "Engage with beneficiaries, provide information about other services, and build community connections.",
            payout: 1200,
            maxCount: 3,
         },
         {
            name: "Safety Monitor",
            description: "Ensure volunteer and beneficiary safety, monitor for any issues, and provide immediate assistance.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Documentation Helper",
            description: "Record distribution data, take photos for documentation, and maintain records of beneficiaries served.",
            payout: 700,
            maxCount: 3,
         },
      ],
      quickLinks: [
         {
            title: "Distribution Guidelines",
            url: "https://example.com/food-distribution-guidelines",
            isActive: true,
         },
         {
            title: "Safety Protocol",
            url: "https://example.com/distribution-safety",
            isActive: true,
         },
         {
            title: "Beneficiary Resources",
            url: "https://example.com/beneficiary-resources",
            isActive: true,
         },
      ],
   },
   {
      title: "Sports Coaching for Kids",
      description:
         "Teach basic sports skills to children from disadvantaged backgrounds. Focus on football, cricket, and athletics.",
      location: "Sports Complex, Kolkata",
      startDate: new Date("2026-02-20T06:00:00Z"),
      endDate: new Date("2026-02-20T10:00:00Z"),
      dressCode: "Sports attire, comfortable shoes",
      category: ["Sports", "Children", "Education"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 18,
      eventRoles: [
         {
            name: "Sports Coach",
            description: "Lead sports training sessions, teach fundamental skills in football, cricket, and athletics. Sports background preferred.",
            payout: 2500,
            maxCount: 2,
         },
         {
            name: "Assistant Coach",
            description: "Support main coaches, work with small groups of children, and help with skill development activities.",
            payout: 1500,
            maxCount: 4,
         },
         {
            name: "Equipment Manager",
            description: "Manage sports equipment, ensure proper setup, and maintain equipment throughout the session.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Child Supervisor",
            description: "Supervise children during activities, ensure safety, and provide encouragement and support.",
            payout: 800,
            maxCount: 6,
         },
         {
            name: "Warm-up Coordinator",
            description: "Lead warm-up exercises, stretching routines, and prepare children for physical activities.",
            payout: 900,
            maxCount: 2,
         },
         {
            name: "Event Photographer",
            description: "Capture action shots, document children's progress, and create memories of the sports session.",
            payout: 1200,
            maxCount: 1,
         },
         {
            name: "Parent Coordinator",
            description: "Communicate with parents, provide updates on children's progress, and handle any concerns.",
            payout: 1000,
            maxCount: 1,
         },
      ],
      quickLinks: [
         {
            title: "Sports Safety Guide",
            url: "https://example.com/sports-safety",
            isActive: true,
         },
         {
            title: "Training Schedule",
            url: "https://example.com/sports-training-schedule",
            isActive: true,
         },
         {
            title: "Equipment List",
            url: "https://example.com/sports-equipment",
            isActive: true,
         },
      ],
   },
   {
      title: "Elderly Care & Companionship",
      description:
         "Spend quality time with elderly residents at a senior care facility. Activities include reading, games, and conversation.",
      location: "Golden Years Senior Home, Jaipur",
      startDate: new Date("2026-02-25T15:00:00Z"),
      endDate: new Date("2026-02-25T19:00:00Z"),
      dressCode: "Comfortable, respectful clothing",
      category: ["Senior Care", "Companionship", "Social Work"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 12,
      eventRoles: [
         {
            name: "Companion Volunteer",
            description: "Spend one-on-one time with elderly residents, engage in conversations, reading, and recreational activities.",
            payout: 1000,
            maxCount: 6,
         },
         {
            name: "Activity Coordinator",
            description: "Organize group activities, games, and entertainment for elderly residents. Creativity and patience required.",
            payout: 1500,
            maxCount: 2,
         },
         {
            name: "Health Monitor",
            description: "Monitor residents' well-being, assist with basic needs, and alert staff to any health concerns.",
            payout: 1200,
            maxCount: 2,
         },
         {
            name: "Facility Liaison",
            description: "Coordinate with facility staff, understand resident needs, and ensure smooth volunteer operations.",
            payout: 1000,
            maxCount: 1,
         },
         {
            name: "Memory Keeper",
            description: "Help residents with memory exercises, record their stories, and create meaningful connections.",
            payout: 1100,
            maxCount: 1,
         },
      ],
      quickLinks: [
         {
            title: "Senior Care Guidelines",
            url: "https://example.com/senior-care-guidelines",
            isActive: true,
         },
         {
            title: "Activity Ideas",
            url: "https://example.com/elderly-activities",
            isActive: true,
         },
         {
            title: "Communication Tips",
            url: "https://example.com/elderly-communication",
            isActive: true,
         },
      ],
   },
   {
      title: "Tree Plantation Drive",
      description:
         "Help plant native trees in urban areas to improve air quality and create green spaces. All equipment provided.",
      location: "City Park, Lucknow",
      startDate: new Date("2026-03-01T08:00:00Z"),
      endDate: new Date("2026-03-01T14:00:00Z"),
      dressCode: "Old clothes, gardening gloves, comfortable shoes",
      category: ["Environment", "Community Service", "Outdoor"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 45,
      eventRoles: [
         {
            name: "Plantation Coordinator",
            description: "Lead tree planting activities, coordinate teams, and ensure proper planting techniques. Horticulture knowledge preferred.",
            payout: 2000,
            maxCount: 2,
         },
         {
            name: "Tree Planter",
            description: "Plant trees according to guidelines, ensure proper spacing, and follow environmental best practices.",
            payout: 800,
            maxCount: 25,
         },
         {
            name: "Equipment Manager",
            description: "Distribute gardening tools, maintain equipment, and ensure all volunteers have necessary supplies.",
            payout: 1000,
            maxCount: 3,
         },
         {
            name: "Watering Coordinator",
            description: "Oversee watering of newly planted trees, ensure proper hydration, and maintain watering schedule.",
            payout: 1200,
            maxCount: 4,
         },
         {
            name: "Site Preparation",
            description: "Prepare planting sites, clear debris, and ensure optimal conditions for tree growth.",
            payout: 900,
            maxCount: 5,
         },
         {
            name: "Documentation Specialist",
            description: "Record planting data, take photos, and maintain records of planted trees and their locations.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Safety Monitor",
            description: "Ensure volunteer safety, monitor for hazards, and provide first aid if needed.",
            payout: 1200,
            maxCount: 2,
         },
         {
            name: "Community Educator",
            description: "Educate volunteers and community members about environmental benefits and tree care.",
            payout: 1100,
            maxCount: 2,
         },
      ],
      quickLinks: [
         {
            title: "Planting Guidelines",
            url: "https://www.arborday.org/trees/planting/",
            isActive: true,
         },
         {
            title: "Tree Care Tips",
            url: "https://example.com/tree-care",
            isActive: true,
         },
         {
            title: "Environmental Impact",
            url: "https://example.com/tree-environmental-benefits",
            isActive: true,
         },
      ],
   },
   {
      title: "Women's Self-Defense Workshop",
      description:
         "Empower women with basic self-defense techniques and safety awareness. Professional instructors will lead the session.",
      location: "Community Hall, Bhopal",
      startDate: new Date("2026-03-05T16:00:00Z"),
      endDate: new Date("2026-03-05T20:00:00Z"),
      dressCode: "Comfortable athletic wear, closed shoes",
      category: ["Women Empowerment", "Safety", "Training"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 30,
      eventRoles: [
         {
            name: "Self-Defense Instructor",
            description: "Lead self-defense training sessions, teach techniques, and ensure participant safety. Martial arts background required.",
            payout: 3000,
            maxCount: 2,
         },
         {
            name: "Assistant Instructor",
            description: "Support main instructors, help participants with techniques, and provide individual guidance.",
            payout: 1800,
            maxCount: 3,
         },
         {
            name: "Safety Coordinator",
            description: "Ensure participant safety during training, monitor for any risks, and provide immediate assistance.",
            payout: 1500,
            maxCount: 2,
         },
         {
            name: "Registration Assistant",
            description: "Handle participant check-in, distribute materials, and manage workshop documentation.",
            payout: 800,
            maxCount: 2,
         },
         {
            name: "Equipment Manager",
            description: "Manage training equipment, ensure proper setup, and maintain safety equipment throughout the session.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Group Facilitator",
            description: "Lead small group activities, facilitate discussions about safety, and ensure all participants are engaged.",
            payout: 1200,
            maxCount: 4,
         },
         {
            name: "Counselor",
            description: "Provide emotional support, address concerns, and help participants feel comfortable and empowered.",
            payout: 1500,
            maxCount: 2,
         },
         {
            name: "Documentation Specialist",
            description: "Record workshop progress, maintain participant records, and prepare certificates of completion.",
            payout: 900,
            maxCount: 2,
         },
         {
            name: "Community Liaison",
            description: "Engage with community members, promote the workshop, and build connections for future programs.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Photography Coordinator",
            description: "Document the workshop (with consent), capture empowering moments, and create awareness materials.",
            payout: 1200,
            maxCount: 1,
         },
      ],
      quickLinks: [
         {
            title: "Safety Resources",
            url: "https://example.com/women-safety-resources",
            isActive: true,
         },
         {
            title: "Technique Videos",
            url: "https://example.com/self-defense-techniques",
            isActive: true,
         },
         {
            title: "Emergency Contacts",
            url: "https://example.com/emergency-contacts",
            isActive: true,
         },
      ],
   },
   {
      title: "Animal Shelter Support",
      description:
         "Help care for abandoned and injured animals at the local shelter. Tasks include feeding, cleaning, and socializing with animals.",
      location: "Pawsome Animal Shelter, Chandigarh",
      startDate: new Date("2026-03-10T09:00:00Z"),
      endDate: new Date("2026-03-10T15:00:00Z"),
      dressCode: "Old clothes, comfortable shoes, no jewelry",
      category: ["Animal Welfare", "Community Service", "Care"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 20,
      eventRoles: [
         {
            name: "Animal Care Specialist",
            description: "Provide direct care to animals, including feeding, grooming, and basic medical assistance. Animal care experience preferred.",
            payout: 1500,
            maxCount: 4,
         },
         {
            name: "Kennel Assistant",
            description: "Clean animal enclosures, maintain hygiene standards, and ensure comfortable living conditions for animals.",
            payout: 1000,
            maxCount: 6,
         },
         {
            name: "Animal Socializer",
            description: "Spend time socializing with animals, help with behavioral training, and provide companionship to shelter residents.",
            payout: 800,
            maxCount: 5,
         },
         {
            name: "Adoption Coordinator",
            description: "Assist with adoption processes, interact with potential adopters, and help match animals with families.",
            payout: 1200,
            maxCount: 2,
         },
         {
            name: "Veterinary Assistant",
            description: "Assist with basic medical procedures, help with vaccinations, and support veterinary staff. Medical background helpful.",
            payout: 1800,
            maxCount: 2,
         },
         {
            name: "Facility Maintenance",
            description: "Help with general maintenance, repairs, and improvements to shelter facilities and equipment.",
            payout: 900,
            maxCount: 1,
         },
      ],
      quickLinks: [
         {
            title: "Animal Care Guidelines",
            url: "https://example.com/animal-care-guidelines",
            isActive: true,
         },
         {
            title: "Safety Protocol",
            url: "https://example.com/animal-safety",
            isActive: true,
         },
         {
            title: "Adoption Process",
            url: "https://example.com/adoption-process",
            isActive: true,
         },
      ],
   },
   {
      title: "Music Therapy for Special Needs",
      description:
         "Use music to help children with special needs develop communication and motor skills. Musical instruments provided.",
      location: "Special Education Center, Vadodara",
      startDate: new Date("2026-03-15T10:00:00Z"),
      endDate: new Date("2026-03-15T16:00:00Z"),
      dressCode: "Comfortable, colorful clothing",
      category: ["Music", "Special Needs", "Therapy"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 15,
      eventRoles: [
         {
            name: "Music Therapist",
            description: "Lead music therapy sessions, work with children with special needs, and use music for therapeutic purposes. Music therapy background required.",
            payout: 3000,
            maxCount: 1,
         },
         {
            name: "Music Assistant",
            description: "Support music therapy activities, help children with instruments, and assist with therapeutic exercises.",
            payout: 1500,
            maxCount: 3,
         },
         {
            name: "Child Support Specialist",
            description: "Provide one-on-one support to children, help them participate in activities, and ensure their comfort and safety.",
            payout: 1200,
            maxCount: 4,
         },
         {
            name: "Instrument Coordinator",
            description: "Manage musical instruments, ensure proper setup, and help children learn to use different instruments.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Parent Liaison",
            description: "Communicate with parents, provide updates on children's progress, and address any concerns or questions.",
            payout: 1100,
            maxCount: 2,
         },
         {
            name: "Activity Recorder",
            description: "Document therapy sessions, record children's progress, and maintain records for therapeutic assessment.",
            payout: 900,
            maxCount: 2,
         },
         {
            name: "Behavioral Support",
            description: "Help manage challenging behaviors, provide positive reinforcement, and support children's emotional needs.",
            payout: 1300,
            maxCount: 1,
         },
      ],
      quickLinks: [
         {
            title: "Music Therapy Guide",
            url: "https://example.com/music-therapy-guide",
            isActive: true,
         },
         {
            title: "Special Needs Resources",
            url: "https://example.com/special-needs-resources",
            isActive: true,
         },
         {
            title: "Instrument Guide",
            url: "https://example.com/therapeutic-instruments",
            isActive: true,
         },
      ],
   },
   {
      title: "Cycling for Clean Air",
      description:
         "Organize a cycling event to promote eco-friendly transportation and raise awareness about air pollution.",
      location: "City Center to Botanical Gardens, Dehradun",
      startDate: new Date("2026-03-20T06:00:00Z"),
      endDate: new Date("2026-03-20T12:00:00Z"),
      dressCode: "Cycling gear, helmet, comfortable shoes",
      category: ["Environment", "Sports", "Awareness"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 50,
      eventRoles: [
         {
            name: "Event Coordinator",
            description: "Lead the cycling event, coordinate participants, and ensure smooth execution of the awareness campaign.",
            payout: 2500,
            maxCount: 2,
         },
         {
            name: "Route Guide",
            description: "Guide cyclists along the route, ensure safety, and provide directions and support during the ride.",
            payout: 1500,
            maxCount: 8,
         },
         {
            name: "Safety Marshal",
            description: "Ensure cyclist safety, monitor traffic, and provide immediate assistance if needed. Cycling experience required.",
            payout: 1200,
            maxCount: 6,
         },
         {
            name: "Awareness Campaigner",
            description: "Distribute educational materials, engage with the public, and promote environmental awareness during the event.",
            payout: 1000,
            maxCount: 10,
         },
         {
            name: "Refreshment Coordinator",
            description: "Manage water stations, provide refreshments, and ensure participants stay hydrated throughout the ride.",
            payout: 800,
            maxCount: 4,
         },
         {
            name: "Photography Team",
            description: "Document the event, capture awareness moments, and create content for environmental advocacy.",
            payout: 1200,
            maxCount: 3,
         },
         {
            name: "Registration Assistant",
            description: "Handle participant registration, distribute event materials, and manage check-in processes.",
            payout: 700,
            maxCount: 4,
         },
         {
            name: "Medical Support",
            description: "Provide first aid support, handle any medical emergencies, and ensure participant well-being.",
            payout: 1500,
            maxCount: 2,
         },
         {
            name: "Equipment Manager",
            description: "Manage cycling equipment, provide bike maintenance support, and ensure all participants have proper gear.",
            payout: 1000,
            maxCount: 3,
         },
         {
            name: "Community Engagement",
            description: "Engage with local communities along the route, explain the event purpose, and build environmental awareness.",
            payout: 900,
            maxCount: 8,
         },
      ],
      quickLinks: [
         {
            title: "Cycling Safety Guide",
            url: "https://example.com/cycling-safety",
            isActive: true,
         },
         {
            title: "Route Map",
            url: "https://example.com/cycling-route",
            isActive: true,
         },
         {
            title: "Environmental Facts",
            url: "https://example.com/air-pollution-facts",
            isActive: true,
         },
      ],
   },
   {
      title: "Nutrition & Cooking Workshop",
      description:
         "Teach families how to prepare healthy, affordable meals using locally available ingredients. Focus on balanced nutrition.",
      location: "Community Kitchen, Mysore",
      startDate: new Date("2026-03-25T14:00:00Z"),
      endDate: new Date("2026-03-25T18:00:00Z"),
      dressCode: "Comfortable clothing, apron provided",
      category: ["Nutrition", "Education", "Cooking"],
      coverUrl: eventCoverImage,
      videoUrl: eventVideo,
      eventImages: [
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
         eventCoverImage,
      ],
      maxVolunteers: 22,
      eventRoles: [
         {
            name: "Nutrition Instructor",
            description: "Lead nutrition education sessions, teach about balanced diets, and provide dietary guidance. Nutrition background preferred.",
            payout: 2500,
            maxCount: 1,
         },
         {
            name: "Cooking Instructor",
            description: "Demonstrate cooking techniques, teach healthy recipes, and guide participants in hands-on cooking activities.",
            payout: 2000,
            maxCount: 2,
         },
         {
            name: "Kitchen Assistant",
            description: "Assist with food preparation, help participants with cooking tasks, and maintain kitchen safety and hygiene.",
            payout: 1200,
            maxCount: 6,
         },
         {
            name: "Ingredient Coordinator",
            description: "Manage ingredients, ensure proper quantities, and help participants understand local ingredient availability.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Family Liaison",
            description: "Work with families, understand their dietary needs, and provide personalized nutrition advice.",
            payout: 1500,
            maxCount: 3,
         },
         {
            name: "Safety Monitor",
            description: "Ensure kitchen safety, monitor for hazards, and provide immediate assistance if needed.",
            payout: 1000,
            maxCount: 2,
         },
         {
            name: "Recipe Coordinator",
            description: "Prepare recipe materials, distribute cooking guides, and help participants document their learning.",
            payout: 800,
            maxCount: 2,
         },
         {
            name: "Cleanup Coordinator",
            description: "Manage kitchen cleanup, ensure proper sanitation, and maintain a clean working environment.",
            payout: 700,
            maxCount: 2,
         },
         {
            name: "Community Educator",
            description: "Engage with community members, promote healthy eating habits, and build awareness about nutrition.",
            payout: 1100,
            maxCount: 2,
         },
      ],
      quickLinks: [
         {
            title: "Nutrition Guide",
            url: "https://example.com/nutrition-guide",
            isActive: true,
         },
         {
            title: "Healthy Recipes",
            url: "https://example.com/healthy-recipes",
            isActive: true,
         },
         {
            title: "Local Ingredients",
            url: "https://example.com/local-ingredients",
            isActive: true,
         },
      ],
   },
];

export async function seedEvents() {
   console.log("🌱 Starting event seeding...");

   try {
      console.log("📝 Adding 5 random events to existing data...");

      // Select 5 random events to seed
      const shuffled = [...events].sort(() => Math.random() - 0.5);
      const eventsToSeed = shuffled.slice(0, 5);
      console.log(`🎲 Selected 5 random events out of ${events.length} total events`);

      console.log("🎉 Creating events...");

      // Use the specified user ID for all events
      const creatorId = "55225ee6-c8c6-47b5-b93b-f72e0a51740e";
      
      // Verify the user exists
      const creator = await prisma.user.findUnique({
         where: { id: creatorId }
      });
      
      if (!creator) {
         console.log(`❌ User with ID ${creatorId} not found. Please ensure the user exists in the database.`);
         throw new Error(`User with ID ${creatorId} not found`);
      }
      
      console.log(`👤 Using creator: ${creator.fullName} (${creator.email})`);

      for (const eventData of eventsToSeed) {
         const { eventRoles, quickLinks, ...eventFields } = eventData;
         
         // Check if event already exists
         const existingEvent = await prisma.event.findFirst({
            where: {
               title: eventData.title,
               location: eventData.location,
               startDate: eventData.startDate,
            },
         });
         
         if (existingEvent) {
            console.log(`⏭️  Skipping existing event: ${eventData.title} (${eventData.location})`);
            continue;
         }
         
         const event = await prisma.event.create({
            data: {
               ...eventFields,
               createdBy: {
                  connect: { id: creatorId },
               },
               eventRoles: {
                  create: eventRoles || [],
               },
               quickLinks: {
                  create: (quickLinks || []).map(link => ({
                     ...link,
                     createdById: creatorId,
                  })),
               },
            },
         });

         console.log(`✅ Created event: ${event.title} (${event.location})`);
      }

      console.log("🎉 Event seeding completed successfully!");
      console.log(`📊 Processed ${eventsToSeed.length} events`);

      // Display summary
      const totalEvents = await prisma.event.count();
      const upcomingEvents = await prisma.event.count({
         where: {
            startDate: {
               gte: new Date(),
            },
         },
      });

      console.log("\n📈 Database Summary:");
      console.log(`Total Events: ${totalEvents}`);
      console.log(`Upcoming Events: ${upcomingEvents}`);
   } catch (error) {
      console.error("❌ Error during event seeding:", error);
      throw error;
   } finally {
      await prisma.$disconnect();
   }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
   seedEvents()
      .then(() => {
         console.log("🚀 Event seeding script finished");
         process.exit(0);
      })
      .catch((error) => {
         console.error("💥 Event seeding failed:", error);
         process.exit(1);
      });
}
