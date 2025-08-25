import { Gender, GovId, Role } from "@/generated/prisma"
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
  address: string;
  gender: Gender;
  govIdType?: GovId;
  govIdImage?: string;
  profileImage?: string;
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
  eventImages: string[];
  maxVolunteers?: number;
}