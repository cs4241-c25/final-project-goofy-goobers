/* eslint-disable @typescript-eslint/no-misused-promises */
import 'dotenv/config';
import express from 'express';
import http from 'http';
import https from 'https';
import { getDB } from './db/init';

const app = express();

try {
  getDB(); // first call is init to guarentee return value
} catch {
  console.error('Database connection error occurred.');
  process.exit(1);
}

const port = process.env.PORT ?? '8081';
const useHTTPS = port === '443' || (process.env.HTTPS ?? 'false') === 'true';

if (useHTTPS) {
  https.createServer({}, app).listen(port);
} else {
  http.createServer(app).listen(port);
}
