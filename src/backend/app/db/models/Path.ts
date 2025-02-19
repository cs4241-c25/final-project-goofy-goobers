import { Schema, model, Types } from 'mongoose';
import { Path as SharedPath } from '../../../../shared/models/Path';

export interface IPath extends SharedPath {
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
