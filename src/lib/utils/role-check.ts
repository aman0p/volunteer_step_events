import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { User as NextAuthUser } from "next-auth";

// Cache for role checks to avoid repeated database queries
const roleCache = new Map<string, { role: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getUserRole(userId: string): Promise<string | null> {
   // Check cache first
   const cached = roleCache.get(userId);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.role;
   }

   try {
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { role: true },
      });

      if (user) {
         // Cache the result
         roleCache.set(userId, {
            role: user.role,
            timestamp: Date.now(),
         });
         return user.role;
      }
      return null;
   } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
   }
}

export async function requireRole(
   requiredRoles: string[]
): Promise<{ user: NextAuthUser; role: string } | null> {
   const session = await getServerSession(authOptions);

   if (!session?.user?.id) {
      return null;
   }

   const role = await getUserRole(session.user.id);

   if (!role || !requiredRoles.includes(role)) {
      return null;
   }

   return { user: session.user, role };
}

export async function requireAdmin(): Promise<{
   user: NextAuthUser;
   role: string;
} | null> {
   return requireRole(["ADMIN", "ORGANIZER"]);
}

export async function requireVolunteer(): Promise<{
   user: NextAuthUser;
   role: string;
} | null> {
   return requireRole(["VOLUNTEER"]);
}

// Clear cache when user role is updated
export function clearRoleCache(userId: string) {
   roleCache.delete(userId);
}
