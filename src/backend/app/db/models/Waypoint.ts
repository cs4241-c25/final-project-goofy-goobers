import { Schema, Types, model } from 'mongoose';

export interface IWaypoint {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
}

export const WaypointSchema = new Schema<IWaypoint>({
  name: String,
  description: String,
  longitude: Number,
  latitude: Number,
});

export const Waypoint = model<IWaypoint>('Waypoint', WaypointSchema);
