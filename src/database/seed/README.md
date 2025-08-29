# Database Seeding Scripts

This directory contains scripts to populate your database with sample data for development and testing purposes.

## Available Scripts

### Individual Seeding Scripts

1. **`pnpm db:seed:verification`** - Seeds users and verification requests
   - Creates sample users with various skills and backgrounds
   - Creates pending verification requests for each user
   - Users start with role 'USER' and are unverified

2. **`pnpm db:seed:events`** - Seeds sample events
   - Creates various types of volunteer events
   - Includes events for healthcare, environment, education, etc.
   - Each event has realistic details, images, and volunteer limits

3. **`pnpm db:seed:enrollments`** - Seeds event enrollments
   - Enrolls volunteers in random events
   - Creates enrollments with various statuses (PENDING, APPROVED, REJECTED, WAITLISTED)
   - Each user enrolls in 1-3 random events

### Master Seeding Script

**`pnpm db:seed:all`** - Runs all seeding scripts in the correct order
1. Seeds users and verification requests
2. Seeds events
3. Seeds enrollments

## Usage

### Run All Seeds (Recommended)
```bash
pnpm db:seed:all
```

### Run Individual Seeds
```bash
# Seed users and verification requests
pnpm db:seed:verification

# Seed events
pnpm db:seed:events

# Seed enrollments (requires users and events to exist first)
pnpm db:seed:enrollments
```

### Prerequisites
- Database must be set up and migrated
- Prisma client must be generated (`pnpm db:generate`)
- Environment variables must be configured

## Data Structure

### Users
- 25 sample users with realistic Indian names and locations
- Various skills and backgrounds
- All users start unverified with pending verification requests

### Events
- 20+ sample events across different categories
- Realistic locations, dates, and descriptions
- ImageKit URLs for covers and videos
- Volunteer capacity limits

### Enrollments
- Random enrollment of users in events
- Weighted status distribution:
  - 40% PENDING
  - 40% APPROVED
  - 15% REJECTED
  - 5% WAITLISTED
- Enrollment dates within the last 30 days

## Notes

- **Warning**: These scripts will clear existing data before seeding
- Each script can be run independently if needed
- The master script ensures proper order and dependencies
- All scripts include detailed logging and error handling
- Scripts are safe to run multiple times (data is cleared first)

## Customization

You can modify the seed data by editing the respective seed files:
- `seed-verification.ts` - User profiles and verification data
- `seed-events.ts` - Event details and configurations
- `seed-enrollments.ts` - Enrollment patterns and status distribution
