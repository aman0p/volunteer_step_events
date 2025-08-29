# Verification Seeding Script

This script creates 15 user accounts and sends 15 verification requests for testing the account verification system.

## What it does

- Creates 15 diverse user accounts with realistic Indian names and details
- Each user has unique skills, addresses, and government ID types
- Automatically creates verification requests for all users
- Uses default profile and government ID images from `/public/default/`

## Prerequisites

1. Make sure your database is running and migrations are applied
2. Ensure you have the required dependencies installed (`bcryptjs`, `@prisma/client`)
3. Verify that your `.env.local` file has the correct `DATABASE_URL`

## Running the script

```bash
# Run the verification seeding script
pnpm db:seed:verification
```

Or manually:

```bash
# Generate Prisma client first
pnpm db:generate

# Run the seeding script
npx tsx src/database/seed-verification.ts
```

## What gets created

### Users (15 total)
- **Priya Sharma** - Event Planning, Communication, Leadership
- **Rajesh Kumar** - Logistics, Team Management, Problem Solving
- **Anjali Patel** - Marketing, Social Media, Creativity
- **Vikram Singh** - Technical Support, Documentation, Training
- **Meera Reddy** - Healthcare, First Aid, Patient Care
- **Arjun Mehta** - Photography, Videography, Editing
- **Kavya Iyer** - Art & Design, Crafting, Workshop Facilitation
- **Rahul Verma** - Sports Coaching, Fitness Training, Motivation
- **Sneha Gupta** - Childcare, Education, Storytelling
- **Aditya Joshi** - Music, Sound Engineering, Performance
- **Zara Khan** - Language Teaching, Translation, Cultural Exchange
- **Dev Malhotra** - IT Support, Web Development, Database Management
- **Ishita Desai** - Environmental Awareness, Sustainability, Community Outreach
- **Karan Thakur** - Emergency Response, Disaster Management, Safety Training
- **Nisha Rao** - Nutrition, Cooking, Health Education

### User Details
- **Password**: `password123` (hashed with bcrypt)
- **Profile Image**: `/default/profile.webp`
- **Government ID Image**: `/default/govt-id.webp`
- **Role**: `USER` (default)
- **Verification Status**: `false` (unverified)

### Verification Requests
- **Status**: `PENDING`
- **Submitted At**: Current timestamp
- **Reviewed By**: `null` (not yet reviewed)

## Default Images Used

The script uses these default images from your `/public/default/` folder:
- `profile.webp` - Default profile picture for all users
- `govt-id.webp` - Default government ID image for all users

## Database Cleanup

⚠️ **Warning**: The script will delete existing users and verification requests with the same emails before creating new ones. If you want to keep existing data, comment out the cleanup section in the script.

## After Running

1. Check your admin panel at `/admin/account-verification`
2. You should see 15 pending verification requests
3. Each request will show the user's name, email, phone number, and status
4. You can now test the approve/reject functionality

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify your `.env.local` file has the correct `DATABASE_URL`
   - Ensure your database is running

2. **Prisma Client Error**
   - Run `pnpm db:generate` first to generate the Prisma client

3. **Image Path Errors**
   - Ensure the default images exist in `/public/default/`
   - Check file permissions

4. **Duplicate Email Error**
   - The script handles this automatically by cleaning up existing data
   - If you get this error, manually delete existing users first

### Reset Database (if needed)

```bash
# Reset the entire database (⚠️ WARNING: This will delete all data)
pnpm db:push --force-reset

# Then run the seeding script
pnpm db:seed:verification
```

## Customization

You can modify the script to:
- Change the number of users
- Modify user details and skills
- Use different default images
- Add more diverse data
- Change the cleanup behavior

## Support

If you encounter any issues, check:
1. Database connection and migrations
2. Prisma client generation
3. File paths and permissions
4. Console output for specific error messages
