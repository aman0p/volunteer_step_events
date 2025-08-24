import { Gender, GovId } from "@/generated/prisma"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
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