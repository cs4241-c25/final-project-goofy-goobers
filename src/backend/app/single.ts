/* eslint-disable @typescript-eslint/no-misused-promises */
import 'dotenv/config';
import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import session from 'express-session';
import { getDB } from './db/init';
import { registerRoutes } from './router';
import { registerAuth } from './server/auth';

export const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'gompei',
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

registerAuth(app);

registerRoutes()
  .then((router) => {
    app.use('/', router);
    // in production, route the bundled html
    if (process.env.NODE_ENV === 'production') {
      console.log(
        'WARNING: Running in PRODUCTION MODE, all undefined routes will go to index.html',
      );
      app.route('*').get((_req, res) => {
        res.sendFile('index.html', { root: path.join(__dirname, '../../frontend') });
      });
    }
  })
  .catch((err: unknown) => {
    console.error('Routes were not able to register.');
    console.error(err);
    process.exit(1);
  });

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
