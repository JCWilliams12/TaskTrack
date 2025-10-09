import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Load environment variables from .env file
dotenv.config();


// 1. List your permanent, static URLs here
const allowedOrigins = [
  'https://task-track-jcwilliams12s-projects.vercel.app/', // <-- Your Production URL
  'http://localhost:5173' // <-- For local development
];

// 2. Create a regex to match your Vercel preview URL pattern
const previewUrlPattern = /^https:\/\/task-track-.*-jcwilliams12s-projects\.vercel\.app$/;

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 3. Allow requests if the origin is in the list OR matches the pattern
    if (!origin || allowedOrigins.includes(origin) || previewUrlPattern.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};


// Enable CORS and standard security middlewares
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// const corsOptions = {
//   //origin: process.env.CLIENT_URL || 'http://localhost:5173'
//   origin: process.env.CLIENT_URL || 'https://task-track-pi-eight.vercel.app',
//   credentials: true
// };
// app.use(cors(corsOptions));

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

// Serve static files from the React app build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../../client/dist');

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(clientBuildPath));

// API root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'TaskTrack API is running', version: '1.0.0' });
});

// Error handlers for API routes - use a function instead of pattern
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return notFoundHandler(req, res);
  }
  next();
});

// Serve React app for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error serving React app:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Catch-all handler for any other non-API routes
app.use((req, res) => {
  // Only serve React app for non-API routes
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving React app:', err);
        res.status(500).send('Error loading application');
      }
    });
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

// General error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));