import { Gender, GovId, Role, VerificationStatus } from "./src/generated/prisma"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: Role
  }
}


interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  // Optional fields populated later via profile update
  address?: string;
  gender?: Gender;
  govIdType?: GovId;
  govIdImage?: string;
  profileImage?: string;
}

// Type for event roles
interface EventRole {
  id?: string;
  name: string;
  description: string;
  payout: number;
  maxCount: number;
}

// Type for quick links
interface QuickLink {
  id?: string;
  title: string;
  url: string;
  isActive: boolean;
}

// Type for creating an event based on the Prisma schema
interface EventParams {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  dressCode: string;
  category: string[];
  coverUrl: string;
  videoUrl: string | null;
  eventImages: string[];
  maxVolunteers?: number;
  createdAt?: Date;
  updatedAt?: Date;
  eventRoles?: EventRole[];
  quickLinks?: QuickLink[];
}

// Type for events returned from database (includes id and matches Prisma schema exactly)
interface Event extends EventParams {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  maxVolunteers: number | null;
}

export type NotificationType =
  | "ENROLLMENT_APPLICATION"
  | "ENROLLMENT_APPROVED"
  | "ENROLLMENT_REJECTED"
  | "ENROLLMENT_WAITLISTED"
  | "ENROLLMENT_CANCELLED"
  | "ENROLLMENT_SELF_CANCELLED"
  | "NEW_EVENT_ADDED"
  | "EVENT_UPDATE"
  | "EVENT_REMINDER"
  | "VERIFICATION_REQUEST"
  | "VERIFICATION_APPROVED"
  | "VERIFICATION_REJECTED"
  | "SYSTEM_MESSAGE";

export type EnrollmentStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WAITLISTED"
  | "CANCELLED";

export type VerificationStatusType =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

// New interface for verification requests
export interface VerificationRequest {
  id: string;
  userId: string;
  status: VerificationStatusType;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedById?: string;

  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
    skills: string[];
    address: string;
    gender: Gender;
    govIdType: GovId;
    govIdImage: string;
  };
}