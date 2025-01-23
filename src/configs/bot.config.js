module.exports = {
  env: process.env.NODE_ENV ?? 'development',
  token: process.env.BOT_TOKEN,
  clientID: process.env.BOT_CLIENT_ID,
  MONGODB_URI: process.env.MONGODB_URI,
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
  },
};
