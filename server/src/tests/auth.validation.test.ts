import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.ts';
import { errorHandler } from '../middleware/errorHandler.ts';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

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

describe('Auth validation', () => {
  it('rejects invalid emails and short passwords on register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'ab', email: 'bad', password: '123' })
      .expect(400);
    expect(res.body.message).toBeDefined();
  });

  it('rejects invalid email on login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: '123456' })
      .expect(400);
    expect(res.body.message).toBeDefined();
  });
});


