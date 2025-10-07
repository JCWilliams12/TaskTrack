import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.ts';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Auth API', () => {
  it('registers and logs in a user', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ username: 'john', email: 'john@example.com', password: 'password' })
      .expect(201);

    expect(registerRes.body.token).toBeDefined();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'password' })
      .expect(200);

    expect(loginRes.body.token).toBeDefined();
  });
});


