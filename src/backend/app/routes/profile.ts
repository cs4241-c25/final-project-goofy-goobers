import { User as SharedUser } from '../../../shared/models/User';
import { IUser, User } from '../db/models/User';
import { requireAuthenticated } from '../middleware/requireAuthentication';
import { Route } from '../router';

export const register = (route: Route) => {
  route({
    handler: (req, res) => {
      const userLookup = req.user as IUser;

      const user: SharedUser = {
        username: userLookup.username,
        name: userLookup.name,
        email: userLookup.email,
      };

      res.json(user);
    },
    middleware: [requireAuthenticated],
    method: 'get',
    route: '/api/profile/current',
  });

  route({
    handler: async (req, res) => {
      const userLookup = await User.findById(req.params.id).exec();

      if (!userLookup) {
        res.status(404).json({ error: 'Profile not found.' });
        return;
      }

      const user: SharedUser = {
        username: userLookup.username,
        name: userLookup.name,
        email: userLookup.email,
      };

      res.send(200).json(user);
    },
    method: 'get',
    route: '/api/profile/:id',
  });
};
