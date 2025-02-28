import Joi from 'joi';
import { Path as SharedPath } from '../../../shared/models/Path';
import { Path } from '../db/models/Path';
import { Route } from '../router';
import { IUser } from '../db/models/User';
import { IWaypoint, Waypoint } from '../db/models/Waypoint';
import { requireAuthenticated } from '../middleware/requireAuthentication';
import { WaypointPayload } from '../../../shared/Payloads';
import { Waypoint as SharedWaypoint } from '../../../shared/models/Waypoint';

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

      res.status(201).json({ id: newPath._id.toHexString() });
    },
    method: 'post',
    route: '/api/path',
    middleware: [requireAuthenticated],
    validate: {
      payload: Joi.object({
        name: Joi.string().min(3).max(1024).required(),
        description: Joi.string().max(40000),
      }).required(),
    },
  });

  // Read
  route({
    handler: async (req, res) => {
      let pathLookup;

      try {
        pathLookup = await Path.findById(req.params.id)
          .populate<{ owner: IUser }>('owner')
          .populate<{ waypoints: IWaypoint[] }>('waypoints')
          .exec();
      } catch {
        /* noop */
      }

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
          path: w._id.toHexString(),
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

      if (!path.owner._id.equals(user._id)) {
        console.log(
          `Illegal access attempted: ${user._id} attempted to access ${path.owner._id}'s path!`,
        );
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      await path.updateOne({
        ...payload,
      });

      await path.save();

      res.send(200);
    },
    method: 'patch',
    route: '/api/path/:id',
    middleware: [requireAuthenticated],
    validate: {
      payload: Joi.object({
        name: Joi.string().min(3).max(1024).required(),
        description: Joi.string().max(40000),
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

      if (!pathLookup.owner._id.equals(user._id)) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      // delete all waypoints
      for (const waypoint of pathLookup.waypoints) {
        await Waypoint.findByIdAndDelete(waypoint._id);
      }

      // delete path
      await pathLookup.deleteOne();

      res.sendStatus(204);
    },
    method: 'delete',
    middleware: [requireAuthenticated],
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

      if (!path.owner._id.equals(user._id)) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      const payload = req.body as WaypointPayload;

      const newWaypoint = await Waypoint.create({
        ...payload,
        path: path._id,
      });

      await newWaypoint.save();

      await path.updateOne({
        waypoints: [...path.waypoints, newWaypoint._id],
      });

      await path.save();

      res.status(201).json({ id: newWaypoint._id.toHexString() });
    },
    method: 'post',
    middleware: [requireAuthenticated],
    route: `/api/path/:id/waypoint`,
    validate: {
      payload: Joi.object({
        name: Joi.string().min(3).max(1024).required(),
        description: Joi.string().max(40000),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-180).max(180).required(),
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

      if (!path.owner._id.equals(user._id)) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      const waypoint = await Waypoint.findById(req.params.wid).exec();

      if (!waypoint || !waypoint.path.equals(path._id)) {
        res.status(404).json({ error: 'Waypoint not found.' });
        return;
      }

      const payload = req.body as WaypointPayload;

      await waypoint.updateOne({
        ...payload,
        path: path._id,
      });

      await waypoint.save();

      res.sendStatus(200);
    },
    method: 'post',
    middleware: [requireAuthenticated],
    route: `/api/path/:id/waypoint/:wid`,
    validate: {
      payload: Joi.object({
        name: Joi.string().min(3).max(1024).required(),
        description: Joi.string().max(40000),
        latitude: Joi.number().min(-90).max(90).required(),
        longitude: Joi.number().min(-90).max(90).required(),
      }),
    },
  });

  // Delete
  route({
    handler: async (req, res) => {
      const path = await Path.findById(req.params.id)
        .populate<{ owner: IUser }>('owner')
        .populate<{ waypoints: IWaypoint[] }>('waypoints')
        .exec();
      const user = req.user as IUser;

      if (!path) {
        res.status(404).json({ error: 'Path not found.' });
        return;
      }

      if (!path.owner._id.equals(user._id)) {
        res.status(403).json({ error: 'You do not own this Path.' });
        return;
      }

      const filteredWaypoints = path.waypoints.filter(
        (w) => w._id.toHexString() !== req.params.wid,
      );

      await path.updateOne({
        waypoints: filteredWaypoints,
      });

      await path.save();

      await Waypoint.findByIdAndDelete(req.params.wid);

      res.sendStatus(204);
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

  // Read all Waypoints on a Path
  route({
    handler: async (req, res) => {
      const waypoints = await Waypoint.find({ path: req.params.id }).exec();

      if (!waypoints.length) {
        res.status(404).json({ error: 'Waypoint not found.' });
        return;
      }

      const sharedWaypoints: SharedWaypoint[] = waypoints.map((wp) => ({
        id: wp._id.toHexString(),
        name: wp.name,
        description: wp.description,
        longitude: wp.longitude,
        latitude: wp.latitude,
        path: wp.path._id.toHexString(),
      }));

      res.status(200).json(sharedWaypoints);
    },
    method: 'get',
    route: `/api/path/:id/waypoints`,
  });
};
