import { Route } from '../router';

export const register = (route: Route) => {
  route({
    handler: (req, res) => {
      res.status(200).json({ message: 'Hello, world!' });
    },
    method: 'get',
    route: '/api',
  });
};
