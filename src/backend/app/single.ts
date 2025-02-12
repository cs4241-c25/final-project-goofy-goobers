/* eslint-disable @typescript-eslint/no-misused-promises */
import 'dotenv/config';
import express from 'express';
import http from 'http';
import https from 'https';

const app = express();
const port = process.env.PORT ?? '8081';
const useHTTPS = port === '443' || (process.env.HTTPS ?? 'false') === 'true';

if (useHTTPS) {
  https.createServer({}, app).listen(port);
} else {
  http.createServer(app).listen(port);
}
