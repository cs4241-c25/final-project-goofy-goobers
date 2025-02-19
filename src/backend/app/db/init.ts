import mongoose from 'mongoose';
import 'dotenv/config';

class DB {
  private connection: typeof mongoose | undefined;
  public constructor() {
    void mongoose
      .connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/')
      .then((connection) => {
        this.connection = connection;
        console.log('Established connection to MongoDB.');
      })
      .catch((err: unknown) => {
        console.error(
          `An error occurred while trying to establish a connection to MongoDB: ${err}`,
        );
        throw err as Error;
      });
  }

  public getConnection() {
    if (!this.connection) {
      throw new Error(`Database is not connected.`);
    }

    return this.connection;
  }
}

let initializedDatabase: DB | undefined = undefined;

export const getDB = () => {
  if (!initializedDatabase) {
    initializedDatabase = new DB();
  }

  return initializedDatabase;
};
