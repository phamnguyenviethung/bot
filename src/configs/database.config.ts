import { DataSource } from 'typeorm';
const wsLogger = require('../utils/logger');
export class Database {
  async getInstance() {
    try {
      const ds = new DataSource({
        type: 'mongodb',
        host: 'cluster0.rvdce.mongodb.net',
        //   port: 27017,
        username: 'pnviethung',
        password: 'pnvieHung',
        database: 'cktg',
      });

      return await ds.initialize();
    } catch (error) {
      wsLogger.error('Lỗi kết nối DB', error);
    }
  }
}
