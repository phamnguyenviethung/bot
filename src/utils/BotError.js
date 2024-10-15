class BotError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'BotError'; // (2)
  }
}

module.exports = BotError;
