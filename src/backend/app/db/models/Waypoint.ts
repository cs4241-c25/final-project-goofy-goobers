import { Schema, model } from 'mongoose';
import { Waypoint as SharedWaypoint } from '../../../../shared/models/Waypoint';

export type IWaypoint = SharedWaypoint;

export const WaypointSchema = new Schema<IWaypoint>({
  name: String,
  longitude: Number,
  latitude: Number,
});

export const Waypoint = model<IWaypoint>('Waypoint', WaypointSchema);
