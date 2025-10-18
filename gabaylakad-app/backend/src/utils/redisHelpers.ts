import redisClient from './redisClient';
import jwt from 'jsonwebtoken';

export async function blacklistToken(token: string, secretKey: string) {
  try {
    // Decode token to get expiry
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.exp) throw new Error('Invalid token');
    const expirySeconds = decoded.exp - Math.floor(Date.now() / 1000);
    if (expirySeconds > 0) {
      await redisClient.set(`bl:${token}`, '1', { EX: expirySeconds });
    }
  } catch (err) {
    console.error('[REDIS BLACKLIST] Error blacklisting token:', err);
  }
}

// Example: Using Redis for session storage
export async function setSession(key: string, value: string, ttlSeconds: number) {
  await redisClient.set(`sess:${key}`, value, { EX: ttlSeconds });
}

export async function getSession(key: string) {
  return await redisClient.get(`sess:${key}`);
}

// Example: Using Redis for caching
export async function setCache(key: string, value: string, ttlSeconds: number) {
  await redisClient.set(`cache:${key}`, value, { EX: ttlSeconds });
}

export async function getCache(key: string) {
  return await redisClient.get(`cache:${key}`);
}
