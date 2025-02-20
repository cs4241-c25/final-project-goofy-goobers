import { Model, Schema, model } from 'mongoose';
import crypto from 'crypto';
import { User as SharedUser } from '../../../../shared/models/User';

export interface IUser extends SharedUser {
  salt: Buffer;
  password: Buffer;
  securityQuestion: string;
  securityAnswer: Buffer;
}

interface IUserMethods {
  validatePassword(password: string): boolean;
  validateAnswer(answer: string): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type UserModel = Model<IUser, {}, IUserMethods>;

export const UserSchema = new Schema<IUser, UserModel, IUserMethods>({
  // TODO: How to handle when Mongoose inevitably throws an error if a username already exists?
  username: { type: String, unique: true },
  name: String,
  password: Schema.Types.Buffer,
  salt: Schema.Types.Buffer,
  email: String,
  securityQuestion: String,
  securityAnswer: Schema.Types.Buffer,
});

UserSchema.pre('save', function (next): void {
  const salt = crypto.randomBytes(128);
  this.salt = salt;

  const hashedPassword = crypto.pbkdf2Sync(this.password, this.salt, 31000, 32, 'sha256');
  this.password = hashedPassword;

  const hashedAnswer = crypto.pbkdf2Sync(this.securityAnswer, this.salt, 31000, 32, 'sha256');
  this.securityAnswer = hashedAnswer;
  next();
});

UserSchema.method('validatePassword', function (password: string): boolean {
  const hashedPassword = crypto.pbkdf2Sync(password, this.salt, 31000, 32, 'sha256');
  return crypto.timingSafeEqual(hashedPassword, this.password);
});

UserSchema.method('validateAnswer', function (answer: string): boolean {
  const hashedAnswer = crypto.pbkdf2Sync(answer, this.salt, 31000, 32, 'sha256');
  return crypto.timingSafeEqual(hashedAnswer, this.securityAnswer);
});

export const User = model<IUser, UserModel>('User', UserSchema);
