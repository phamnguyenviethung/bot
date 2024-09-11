const mongoose = require("mongoose");
const wsLogger = require("../utils/wsLogger");
async function connect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    wsLogger.info("Ket noi database thanh cong");
  } catch (error) {
    wsLogger.error(error);
    wsLogger.error("Ket noi database that bai");
  }
}

module.exports = { connect };
