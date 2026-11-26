
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Item } from '../src/models/Item.js';
import { User } from '../src/models/User.js';

process.env.JWT_SECRET = 'test-secret';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  // build the unique indexes (needed for the 409 duplicate test)
  await Item.syncIndexes();
  await User.syncIndexes();
});

afterEach(async () => {
  // every test starts with an empty database
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});
