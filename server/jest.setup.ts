import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';


