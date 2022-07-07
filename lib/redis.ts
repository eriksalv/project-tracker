import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "localhost:6379");

export default redis;
