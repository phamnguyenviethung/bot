// redisClient.js
const Redis = require('ioredis');
const { logger } = require('./logger.config');
const botConfig = require('./bot.config');

// Sử dụng cấu hình từ môi trường
const redis = new Redis({
  port: botConfig.redis.port,
  host: botConfig.redis.host,
  username: botConfig.redis.username,
  password: botConfig.redis.password,
  db: botConfig.redis.db, // Defaults to 0
});

redis.on('error', (err) => logger.error('Redis connection error:', err));

module.exports = redis;
