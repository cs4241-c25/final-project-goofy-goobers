import { route } from '../router';

route({
  handler: (req, res) => {
    res.status(200).json({ message: 'Hello, world!' });
  },
  method: 'get',
  route: '/api',
});
