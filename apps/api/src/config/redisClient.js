const { createClient } = require('redis');

const redisClient = createClient({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT) || 10000,
    keepAlive: Number(process.env.REDIS_KEEP_ALIVE) || 30000,
    // tls: true, // enable if your Redis Cloud db requires TLS
  },
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

async function connectRedis() {
  if (redisClient.isOpen || redisClient.isReady) return;

  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (error) {
    console.error('❌ Redis connect failed:', error.message);
  }
}

module.exports = {
  redisClient,
  connectRedis,
};
