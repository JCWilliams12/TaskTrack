import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../routes/auth.ts';
import taskRoutes from '../routes/tasks.ts';

dotenv.config({ path: '.env.test' });

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

let mongod: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  process.env.JWT_SECRET = 'test-secret';

  const r = await request(app).post('/api/auth/register').send({ username: 'stats', email: 's@example.com', password: 'password' });
  token = r.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Tasks stats', () => {
  it('computes stats correctly', async () => {
    const auth = { Authorization: `Bearer ${token}` };
    await request(app).post('/api/tasks').set(auth).send({ title: 't1', status: 'completed' }).expect(201);
    await request(app).post('/api/tasks').set(auth).send({ title: 't2', status: 'pending' }).expect(201);
    await request(app).post('/api/tasks').set(auth).send({ title: 't3', status: 'in-progress' }).expect(201);

    const res = await request(app).get('/api/tasks/stats/summary').set(auth).expect(200);
    expect(res.body.totalTasks).toBe(3);
    expect(typeof res.body.completionRate).toBe('number');
    expect(Array.isArray(res.body.statusBreakdown)).toBe(true);
    expect(Array.isArray(res.body.priorityBreakdown)).toBe(true);
  });
});


