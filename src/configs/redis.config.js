// redisClient.js
const Redis = require('ioredis');
const { logger } = require('./logger.config');

// Sử dụng cấu hình từ môi trường
const redis = new Redis({
  port: 6379,
  host: 'localhost',
  username: 'default',
  password: '1234',
  db: 2, // Defaults to 0
});

redis.on('error', (err) => logger.error('Redis connection error:', err));

module.exports = redis;
