import Joi from 'joi';
import { Path as SharedPath } from '../../../shared/models/Path';
import { Path } from '../db/models/Path';
import { Route } from '../router';
import { IUser } from '../db/models/User';
import { IWaypoint, Waypoint } from '../db/models/Waypoint';
import { requireAuthenticated } from '../middleware/requireAuthentication';
import { WaypointPayload } from '../../../shared/Payloads';

export const register = (route: Route) => {
  /* Start Path CRUD */

  // Create
  route({
    handler: async (req, res) => {
      const payload = req.body as { name: string; description?: string };
      const user = req.user as IUser;
      const newPath = await Path.create({
        ...payload,
        owner: user._id,
      });

      await newPath.save();

      res.send(201).json({ id: newPath._id.toHexString() });
    },
    method: 'post',
    route: '/api/path',
    middleware: [requireAuthenticated],
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
      }).required(),
    },
  });

  // Read
  route({
    handler: async (req, res) => {
      const pathLookup = await Path.findById(req.params.id)
        .populate<{ owner: IUser }>('owner')
        .populate<{ waypoints: IWaypoint[] }>('waypoints')
        .exec();

      if (!pathLookup) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      const path: SharedPath = {
        id: pathLookup._id.toHexString(),
        name: pathLookup.name,
        description: pathLookup.description,
        owner: { username: pathLookup.owner.username },
        waypoints: pathLookup.waypoints.map((w) => ({
          id: w._id.toHexString(),
          name: w.name,
          description: w.description,
          latitude: w.latitude,
          longitude: w.longitude,
        })),
      };

      res.status(200).json(path);
    },
    method: 'get',
    route: `/api/path/:id`,
  });

  // Update
  route({
    handler: async (req, res) => {
      const payload = req.body as { name: string; description?: string };
      const path = await Path.findById(req.params.id).populate<{ owner: IUser }>('owner').exec();
      const user = req.user as IUser;

      if (!path) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (path.owner._id !== user._id) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      await path.updateOne({
        ...payload,
      });

      res.send(200);
    },
    method: 'patch',
    route: '/api/path/:id',
    middleware: [requireAuthenticated],
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
      }).required(),
    },
  });

  // Delete
  route({
    handler: async (req, res) => {
      const pathLookup = await Path.findById(req.params.id)
        .populate<{ owner: IUser }>('owner')
        .populate<{ waypoints: IWaypoint[] }>('waypoints')
        .exec();

      const user = req.user as IUser;

      if (!pathLookup) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (pathLookup.owner._id !== user._id) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      // delete all waypoints
      for (const waypoint of pathLookup.waypoints) {
        await Waypoint.findByIdAndDelete(waypoint._id);
      }

      // delete path
      await pathLookup.deleteOne();

      res.status(204);
    },
    method: 'delete',
    route: `/api/path/:id`,
  });

  /* End Path CRUD */

  /* Start Waypoint CRUD */

  // Create
  route({
    handler: async (req, res) => {
      const path = await Path.findById(req.params.id).populate<{ owner: IUser }>('owner').exec();
      const user = req.user as IUser;

      if (!path) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (path.owner._id !== user._id) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      const payload = req.body as WaypointPayload;

      const newWaypoint = await Waypoint.create({
        ...payload,
      });
      await newWaypoint.save();

      path.waypoints.push(newWaypoint._id);

      res.status(201).json({ id: newWaypoint._id.toHexString() });
    },
    method: 'post',
    middleware: [requireAuthenticated],
    route: `/api/path/:id/waypoint`,
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    },
  });

  // Read located in waypoint.ts

  // Update
  route({
    handler: async (req, res) => {
      const path = await Path.findById(req.params.id).populate<{ owner: IUser }>('owner').exec();
      const user = req.user as IUser;

      if (!path) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (path.owner._id !== user._id) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      const waypoint = await Waypoint.findById(req.params.wid).exec();

      if (!waypoint) {
        res.status(404).json({ error: 'Waypoint not found.' });
        return;
      }

      const payload = req.body as WaypointPayload;

      await waypoint.updateOne({
        ...payload,
      });

      res.status(200);
    },
    method: 'post',
    middleware: [requireAuthenticated],
    route: `/api/path/:id/waypoint/:wid`,
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
      }),
    },
  });

  // Delete
  route({
    handler: async (req, res) => {
      const path = await Path.findById(req.params.id).populate<{ owner: IUser }>('owner').exec();
      const user = req.user as IUser;

      if (!path) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (path.owner._id !== user._id) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      await Waypoint.findByIdAndDelete(req.params.wid);

      res.status(204);
    },
    method: 'delete',
    middleware: [requireAuthenticated],
    route: `/api/path/:id/waypoint/:wid`,
  });

  /* End Waypoint CRUD */

  route({
    handler: async (req, res) => {
      const user = req.user as IUser;
      const pathsLookup = await Path.find({ owner: user._id })
        .populate<{ owner: IUser }>('owner')
        .populate<{ waypoints: IWaypoint[] }>('waypoints')
        .exec();

      const paths = pathsLookup.map(
        (path) =>
          ({
            id: path._id.toHexString(),
            name: path.name,
            description: path.description,
            waypoints: path.waypoints.map((w) => ({
              id: w._id.toHexString(),
              name: w.name,
              description: w.description,
              latitude: w.latitude,
              longitude: w.longitude,
            })),
            owner: {
              username: path.owner.username,
            },
          }) as SharedPath,
      );

      res.status(200).json(paths);
    },
    middleware: [requireAuthenticated],
    method: 'get',
    route: '/api/paths/me',
  });

  route({
    handler: async (_req, res) => {
      const pathsLookup = await Path.find({})
        .populate<{ owner: IUser }>('owner')
        .populate<{ waypoints: IWaypoint[] }>('waypoints')
        .exec();

      const paths = pathsLookup.map(
        (path) =>
          ({
            id: path._id.toHexString(),
            name: path.name,
            description: path.description,
            waypoints: path.waypoints.map((w) => ({
              id: w._id.toHexString(),
              name: w.name,
              description: w.description,
              latitude: w.latitude,
              longitude: w.longitude,
            })),
            owner: {
              username: path.owner.username,
            },
          }) as SharedPath,
      );

      res.status(200).json(paths);
    },
    method: 'get',
    route: '/api/paths/all',
  });
};
