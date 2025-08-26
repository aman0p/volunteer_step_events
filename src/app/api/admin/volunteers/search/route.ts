import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ volunteers: [] });
    }

    const searchTerm = query.trim();

    // Search volunteers by name, email, or skills
    const volunteers = await prisma.user.findMany({
      where: {
        AND: [
          { role: "VOLUNTEER" },
          {
            OR: [
              { fullName: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
              { skills: { hasSome: [searchTerm] } }
            ]
          }
        ]
      },
      include: {
        enrollments: {
          include: {
            event: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: { enrolledAt: "desc" },
          take: 5 // Limit to recent 5 enrollments
        }
      },
      take: 10, // Limit search results
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ volunteers });
  } catch (error) {
    console.error("Volunteer search error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
