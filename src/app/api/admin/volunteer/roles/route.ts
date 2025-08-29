import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma";

type Role = "USER" | "VOLUNTEER" | "ORGANIZER" | "ADMIN";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "ORGANIZER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const updates: Array<{ userId: string; role: Role }> = Array.isArray(body?.updates) ? body.updates : [];
    if (updates.length === 0) {
      return NextResponse.json({ ok: true, updated: 0 });
    }

    const allowedRoles: Role[] = currentUser.role === "ADMIN"
      ? ["USER", "VOLUNTEER"]
      : ["USER", "VOLUNTEER", "ADMIN"];

    const validUpdates = updates.filter((u) => allowedRoles.includes(u.role));

    if (validUpdates.length === 0) {
      return NextResponse.json({ ok: true, updated: 0 });
    }

    // Get current roles for comparison
    const currentUsers = await prisma.user.findMany({
      where: { id: { in: validUpdates.map(u => u.userId) } },
      select: { id: true, role: true }
    });

    const currentRoles = Object.fromEntries(currentUsers.map(u => [u.id, u.role]));

    const result = await prisma.$transaction(
      validUpdates.map((u) =>
        prisma.user.update({
          where: { id: u.userId },
          data: { role: u.role },
          select: { id: true },
        })
      )
    );

    // Send notifications to affected users
    if (result.length > 0) {
      await prisma.notification.createMany({
        data: validUpdates.map((u) => {
          const rolePriority: Record<string, number> = { ORGANIZER: 1, ADMIN: 2, VOLUNTEER: 3, USER: 4 }
          const oldRole = currentRoles[u.userId] || 'USER'
          const oldPriority = rolePriority[oldRole] ?? 99
          const newPriority = rolePriority[u.role] ?? 99
          const isUpgrade = newPriority < oldPriority
          const action = isUpgrade ? 'upgraded' : 'downgraded'
          
          return {
            userId: u.userId,
            type: NotificationType.SYSTEM_MESSAGE,
            title: "Role Updated",
            message: `Your role has been ${action} to ${u.role.toLowerCase()}.`,
          }
        }),
      });
    }

    return NextResponse.json({ ok: true, updated: result.length });
  } catch (error) {
    console.error("Error updating roles", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


