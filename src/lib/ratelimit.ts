import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/database/redis"

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "2m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});