import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.ts';
import taskRoutes from '../routes/tasks.ts';
import { errorHandler } from '../middleware/errorHandler.ts';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(errorHandler);

let mongod: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  process.env.JWT_SECRET = 'test-secret';
  const r = await request(app).post('/api/auth/register').send({ username: 'c', email: 'c@example.com', password: 'password' });
  token = r.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Tasks validation', () => {
  it('rejects invalid task create payload', async () => {
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' })
      .expect(400);
  });

  it('rejects invalid task id on get', async () => {
    await request(app)
      .get('/api/tasks/not-a-mongoid')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});


