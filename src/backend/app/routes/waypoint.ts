import { Waypoint as SharedWaypoint } from '../../../shared/models/Waypoint';
import { Waypoint } from '../db/models/Waypoint';
import { Route } from '../router';

export const register = (route: Route) => {
  route({
    handler: async (req, res) => {
      const waypointLookup = await Waypoint.findById(req.params.id).exec();

      if (!waypointLookup) {
        res.status(404).json({ error: 'Waypoint not found.' });
        return;
      }

      const waypoint: SharedWaypoint = {
        id: waypointLookup._id.toHexString(),
        name: waypointLookup.name,
        description: waypointLookup.description,
        longitude: waypointLookup.longitude,
        latitude: waypointLookup.latitude,
      };

      res.status(200).json(waypoint);
    },
    method: 'get',
    route: `/api/waypoint/:id`,
  });
};
