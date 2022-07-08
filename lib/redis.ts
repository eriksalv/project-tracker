import Redis from "ioredis";

let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS_URL || "localhost:6379");
} else {
  if (!(global as any).redis) {
    (global as any).redis = new Redis(
      process.env.REDIS_URL || "localhost:6379"
    );
  }
  redis = (global as any).redis;
}

export default redis;
