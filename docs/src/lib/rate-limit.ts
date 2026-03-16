import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const checkRateLimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  redis,
});
