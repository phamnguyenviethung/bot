import 'reflect-metadata';
// this shim is required
import { createExpressServer } from 'routing-controllers';
import { UserController } from './controllers/user.controller';
const wsLogger = require('@/utils/wsLogger');
const app = createExpressServer({
  controllers: [UserController],
});

const PORT = process.env.PORT || 4000;

const start = () => {
  app.listen(PORT, () => {
    wsLogger.info(`Server is running on port http://localhost:${PORT} `);
  });
};

module.exports = { start };
