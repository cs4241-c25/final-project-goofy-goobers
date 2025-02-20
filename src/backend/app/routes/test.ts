import { Route } from '../router';

export const register = (route: Route) => {
  route({
    handler: (_req, res) => {
      res.status(200).json({ message: 'Hello, world!' });
    },
    method: 'get',
    route: '/api/test',
  });

  // This server is not able to brew coffee due to being a teapot.
  // Do not allow brews and alert the user of being a teapot.
  // For more information visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/418
  route({
    handler: (_req, res) => {
      res.status(418).json({ message: "I'm a teapot" });
    },
    method: 'get',
    route: '/api/test/brew',
  });
};
