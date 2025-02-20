# Routes
Please take note of the structure that routes take, as it is different from normal Express.

## Conventions
1. Routes must be placed in the `src/backend/app/routes` folder.
2. All routes must be prefixed by `/api/`.
3. If a file in the `routes` folder is titled `example`, then all routes it defines must be prefixed by `/api/example/`.
4. Each route is defined by a call to the `route` method.
5. The `route` method accepts an object of parameters.
    1. The `handler` property is required, it is where you define your router handler with `req` and `res`.
    2. The `method` property is required, and defines the HTTP method used (such as `GET` or `POST`).
    3. The `middleware` property is optional, and is a list of necessary middlewares. 
    4. The `validate` property is optional, and is where you can use Joi schemas to define expected data for the `req.body` and `req.query` via `payload` and `query` properties respectively.

**NOTE:** When defining an interface to cast types onto the `req.body`, define it in `shared` so that way the frontend can also assert the submitted data is correct.

## Example
```TS
/* src/backend/app/routes/example.ts */
import { Route } from '../router';
import Joi from 'joi';
import passport from 'passport';

export const register = (route: Route) => {
  route({
    handler: (req, res) => {
      res.status(200).json({ message: 'Hello, world!' });
    },
    method: 'get',
    route: '/api/example/hello',
  });

  route({
    handler: (req, res) => {
      res.status(200).json(req.user);
    },
    method: 'post',
    route: `/api/example/login`,
    middleware: [passport.authenticate('local')],
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
  });
};
```