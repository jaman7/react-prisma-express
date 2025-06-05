import { createClient } from 'redis';
import logger from './logger';

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({ url: redisUrl });

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis connection error', error);
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
