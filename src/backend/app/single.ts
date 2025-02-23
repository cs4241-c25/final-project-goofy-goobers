import 'dotenv/config';
import express from 'express';
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

app.listen(port, () => {
  console.log('Server is running!');
});
