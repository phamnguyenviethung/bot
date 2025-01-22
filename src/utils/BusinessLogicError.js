class BusinessLogicError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = 'BusinessLogicError'; // (2)
  }
}

module.exports = BusinessLogicError;
