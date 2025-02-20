import { Schema, model } from 'mongoose';
import { User as SharedUser } from '../../../../shared/models/User';

export interface IUser extends SharedUser {
  password: string;
}

export const UserSchema = new Schema<IUser>({
  username: String,
  name: String,
  password: String, // TODO: Modify for Authentication implementation
  email: String,
  emailVerified: Boolean,
});

export const User = model<IUser>('User', UserSchema);
