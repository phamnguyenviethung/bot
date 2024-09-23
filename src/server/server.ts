import 'reflect-metadata';
// this shim is required
const express = require('express');
import { createExpressServer } from 'routing-controllers';

const wsLogger = require('@/utils/wsLogger');
const path = require('path');
const fs = require('fs');
const controllers = [];

const app = createExpressServer({
  cors: true,
  controllers: [path.resolve(__dirname, './controllers/*.controller.ts')],
});

const PORT = process.env.PORT || 4000;

const start = () => {
  app.use(express.json());
  app.listen(PORT, () => {
    wsLogger.info(`Server is running on port http://localhost:${PORT} `);
  });
};

module.exports = { start };
