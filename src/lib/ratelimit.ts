import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/database/redis"

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "5m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});