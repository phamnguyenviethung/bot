module.exports = {
  env: process.env.NODE_ENV ?? 'development',
  token: process.env.BOT_TOKEN,
  clientID: process.env.BOT_CLIENT_ID,
  MONGODB_URI: process.env.MONGODB_URI,
};
