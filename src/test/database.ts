import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

mongoose.Promise = global.Promise;

class Connection {
  private mongoServer: MongoMemoryServer;
  public connection: mongoose.Connection | null;

  constructor() {
    this.mongoServer = new MongoMemoryServer();
    this.connection = null;
  }

  async connect(): Promise<void> {
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();

    const mongooseOpts: ConnectOptions = {
      serverSelectionTimeoutMS: 1000,
    }

     await mongoose.connect(mongoUri, mongooseOpts);
    this.connection = mongoose.connection;
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    await this.mongoServer.stop();
  }

  async cleanup(): Promise<void> {
    const models = Object.keys(this.connection?.models || {});
    const promises: Promise<any>[] = [];

    models.forEach((model) => {
      promises.push(this.connection?.models[model].deleteMany({}));
    });

    await Promise.all(promises);
  }
}

/**
 * Create the initial database connection.
 *
 * @async
 * @return {Promise<Connection>}
 */
export const connect = async (): Promise<Connection> => {
  const conn = new Connection();
  await conn.connect();
  return conn;
};
