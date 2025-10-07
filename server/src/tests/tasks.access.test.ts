import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.ts';
import taskRoutes from '../routes/tasks.ts';
import { errorHandler } from '../middleware/errorHandler.ts';
import Task from '../models/Task.ts';
import User from '../models/User.ts';

dotenv.config({ path: '.env.test' });

const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use(errorHandler);
  return app;
};

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

describe('Tasks access control', () => {
  it('prevents access without token', async () => {
    const app = makeApp();
    await request(app).get('/api/tasks').expect(401);
  });

  it('prevents user A from accessing user B task', async () => {
    const app = makeApp();

    const a = await request(app).post('/api/auth/register').send({ username: 'alex', email: 'a@example.com', password: 'password' }).expect(201);
    const b = await request(app).post('/api/auth/register').send({ username: 'bruce', email: 'b@example.com', password: 'password' }).expect(201);

    // Create a task directly in DB for user A
    const created = await Task.create({ title: 'A task', userId: a.body.user.id });

    await request(app)
      .get(`/api/tasks/${created._id}`)
      .set('Authorization', `Bearer ${b.body.token}`)
      .expect(404);
  });
});


