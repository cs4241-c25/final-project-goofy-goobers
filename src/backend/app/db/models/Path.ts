import { Schema, model, Types } from 'mongoose';

export interface IPath {
  name: string;
  description?: string;
  owner: Types.ObjectId;
  waypoints: Types.ObjectId[];
}

const PathSchema = new Schema<IPath>({
  name: String,
  description: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }, // FK to User
  waypoints: [{ type: Schema.Types.ObjectId, ref: 'Waypoint' }], // list of FKs to Waypoint
});

export const Path = model<IPath>('Path', PathSchema);
