// redisClient needed for blacklisting tokens
import { createClient } from 'redis';
import dotenv from 'dotenv'
dotenv.config();

const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || '127.0.0.1',  // Redis host
      port: 6379,  // Redis port (default is 6379)
    }
  });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

export default redisClient;
