/* eslint-disable @typescript-eslint/no-misused-promises */
import 'dotenv/config';
import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import session from 'express-session';
import { getDB } from './db/init';
import { router } from './router';

export const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'gompei',
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/', router);

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
