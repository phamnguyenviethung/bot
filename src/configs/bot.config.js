module.exports = {
  env: process.env.NODE_ENV ?? 'development',
  token: process.env.BOT_TOKEN,
  clientID: process.env.BOT_CLIENT_ID,
  MONGODB_URI: process.env.MONGODB_URI,
  redis: {
    port: 6379,
    host: 'localhost',
    username: 'default',
    password: '1234',
    db: 2,
  },
};
