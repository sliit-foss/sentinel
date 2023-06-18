const Redis = require('ioredis').default;
const config = require('../../config');

const redis = new Redis(config.REDIS_CONNECTION_STRING);

redis.on('connect', () => console.info('Redis connected'));
redis.on('error', (err) => console.error(`Redis error - message: ${err.message}`, err));

redis.setKey = redis.set;

redis.set = (key, value, ttl) => {
  if (typeof value !== 'string') value = JSON.stringify(value);
  return redis.setKey(key, value, 'EX', ttl ?? 30);
};

redis.getOrDefault = async (key, defaultValue) => {
  let res = await redis.get(key);
  if (res) return JSON.parse(res);
  res = typeof defaultValue === 'function' ? await defaultValue() : defaultValue;
  if (res) redis.set(key, JSON.stringify(res));
  return res;
};

module.exports = { redis };
