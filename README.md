# Volunteer Step Events
Volunteer Management App with Admin panel

## Features

- Admin panel
- Volunteer management
- Event management
- User management
- Role-based access control
- Reporting and analytics


## cmd to generate prisma client explicitly for neon

```bash
pnpm dotenv -e .env -- prisma migrate deploy
```

## Local Database Seeding

To seed your local Docker database with verification data:

```bash
# Seed verification data in local database
npx dotenv -e .env.local -- npx tsx src/database/seed/seed-verification.ts

# Alternative: Use the package.json script
pnpm db:seed:verification
```

To seed events in your local database:

```bash
# Seed events in local database
npx dotenv -e .env.local -- npx tsx src/database/seed/seed-events.ts

# Seed enrollment requests in local database
npx dotenv -e .env.local -- npx tsx src/database/seed/seed-enrollments.ts

# Alternative: Use the package.json script
pnpm db:seed:events
```

**Note**: Make sure your local Docker database is running before seeding:
```bash
docker-compose up -d
```

## ImageKit Configuration

The application uses [ImageKit](https://imagekit.io/) for optimized image delivery and management. Event images are served from ImageKit CDN for better performance.

### Environment Variables
```bash
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/praveenlodhiofficial
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### Image URLs
- **Events Base URL**: `https://ik.imagekit.io/praveenlodhiofficial/events/covers/`
- **Events Video URL**: `https://ik.imagekit.io/praveenlodhiofficial/events/videos/`
- **Users Base URL**: `https://ik.imagekit.io/praveenlodhiofficial/users/`
- **Sample Event Image**: [GettyImages Event Cover](https://ik.imagekit.io/praveenlodhiofficial/events/covers/GettyImages-2150511667_qOTkTK4gjB.webp?updatedAt=1756216640045)
- **Sample Event Video**: [Event Video](https://ik.imagekit.io/praveenlodhiofficial/events/videos/event-video_78RaIcuDn.mp4?updatedAt=1756424686119)
- **Sample Profile Image**: [User Profile](https://ik.imagekit.io/praveenlodhiofficial/users/profile/profile_nQkcdEiM1.webp?updatedAt=1756423316001)
- **Sample Govt ID Image**: [Government ID](https://ik.imagekit.io/praveenlodhiofficial/users/gov-id/govt-id_hTp9DNNv8.webp?updatedAt=1756423306534)

### Benefits
- **CDN Delivery**: Global content delivery network
- **Image Optimization**: Automatic format conversion and compression
- **Responsive Images**: Automatic resizing for different devices
- **Performance**: Faster image loading times

<!-- Issue to be fixed later -->

1. Rate limit is not working as expected
2. Change the email from `` to the actual professional email