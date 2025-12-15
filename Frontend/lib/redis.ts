import { Redis } from "@upstash/redis";

const isValidRedisConfig = () => {
  const url = process.env.REDIS_URL;
  const token = process.env.REDIS_TOKEN;

  // Check if vars exist and aren't placeholder values
  if (!url || !token) return false;
  if (url.includes('your_redis') || token.includes('your_redis')) return false;
  if (!url.startsWith('https://')) return false;

  return true;
};

if (!isValidRedisConfig()) {
  console.warn(
    "REDIS_URL or REDIS_TOKEN environment variable is not defined or invalid, please add to enable background notifications and webhooks."
  );
}

export const redis = isValidRedisConfig()
    ? new Redis({
        url: process.env.REDIS_URL!,
        token: process.env.REDIS_TOKEN!,
      })
    : null;
