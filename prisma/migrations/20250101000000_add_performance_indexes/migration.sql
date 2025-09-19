-- Add performance indexes to improve query speed

-- Index for user role lookups (most common query)
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");

-- Index for enrollment status queries
CREATE INDEX IF NOT EXISTS "Enrollment_status_idx" ON "Enrollment"("status");

-- Index for enrollment user and event lookups
CREATE INDEX IF NOT EXISTS "Enrollment_userId_eventId_idx" ON "Enrollment"("userId", "eventId");

-- Index for event start date ordering
CREATE INDEX IF NOT EXISTS "Event_startDate_idx" ON "Event"("startDate");

-- Index for event creator lookups
CREATE INDEX IF NOT EXISTS "Event_createdById_idx" ON "Event"("createdById");

-- Index for verification request status
CREATE INDEX IF NOT EXISTS "VerificationRequest_status_idx" ON "VerificationRequest"("status");

-- Index for user last active date
CREATE INDEX IF NOT EXISTS "User_lastActiveAt_idx" ON "User"("lastActiveAt");

-- Composite index for enrollment queries with status and event
CREATE INDEX IF NOT EXISTS "Enrollment_eventId_status_idx" ON "Enrollment"("eventId", "status");
