import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

const app = express();

// Load environment variables from .env file
dotenv.config();

// CORS Configuration
const corsOptions = {
  //origin: process.env.CLIENT_URL || 'http://localhost:5173'
  origin: process.env.CLIENT_URL || 'https://task-track-pi-eight.vercel.app',
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to the database
connectDB();
// --- End of Connection Logic ---

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TaskTrack API is running' });
});

app.get('/', (req, res) => {
  res.send('TaskTrack API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));