import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
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
      console.warn('MONGO_URI is not defined in the .env file. Server will start without database.');
      return;
    }

    // Set connection timeout
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
    };

    await mongoose.connect(mongoUri, options);
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    console.warn('Server will start without database connection. Some features may not work.');
    // Don't exit process - let server start without DB
  }
};

// Connect to the database (non-blocking)
connectDB().catch(console.error);
// --- End of Connection Logic ---

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint (doesn't require database)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'TaskTrack API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Serve static files from the React app build directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Try multiple possible paths for the client build directory
const possiblePaths = [
  path.join(__dirname, '../../client/dist'),           // Development: server/dist -> client/dist
  path.join(__dirname, '../client/dist'),              // Alternative: server/dist -> client/dist
  path.join(process.cwd(), 'client/dist'),             // Production: from project root
  path.join(process.cwd(), 'dist/client'),             // Alternative production path
];

let clientBuildPath: string | null = null;
for (const possiblePath of possiblePaths) {
  if (fs.existsSync(possiblePath)) {
    clientBuildPath = possiblePath;
    break;
  }
}

if (!clientBuildPath) {
  console.warn('Could not find client build directory. Tried paths:', possiblePaths);
  console.warn('Server will run without React app. Please build the client first.');
}

console.log('Serving React app from:', clientBuildPath);

// Serve static files (CSS, JS, images, etc.)
if (clientBuildPath) {
  app.use(express.static(clientBuildPath));
}

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
  if (clientBuildPath) {
    res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
      if (err) {
        console.error('Error serving React app:', err);
        res.status(500).send('Error loading application');
      }
    });
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TaskTrack API</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .error { color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 4px; }
            .info { color: #1976d2; background: #e3f2fd; padding: 20px; border-radius: 4px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>TaskTrack API</h1>
            <div class="error">
              <h3>React App Not Found</h3>
              <p>The React client application has not been built yet.</p>
              <p>Please run <code>npm run build</code> to build the client application.</p>
            </div>
            <div class="info">
              <h3>API Endpoints Available:</h3>
              <ul>
                <li><code>GET /api</code> - API information</li>
                <li><code>POST /api/auth/register</code> - Register user</li>
                <li><code>POST /api/auth/login</code> - Login user</li>
                <li><code>GET /api/auth/me</code> - Get current user</li>
                <li><code>GET /api/tasks</code> - Get tasks</li>
                <li><code>POST /api/tasks</code> - Create task</li>
                <li>And more...</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  }
});

// Catch-all handler for any other non-API routes
app.use((req, res) => {
  // Only serve React app for non-API routes
  if (!req.path.startsWith('/api/')) {
    if (clientBuildPath) {
      res.sendFile(path.join(clientBuildPath, 'index.html'), (err) => {
        if (err) {
          console.error('Error serving React app:', err);
          res.status(500).send('Error loading application');
        }
      });
    } else {
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head><title>404 - Not Found</title></head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>React app not built. Please run <code>npm run build</code> first.</p>
          </body>
        </html>
      `);
    }
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

// General error handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`📱 React app: http://localhost:${PORT}/`);
  console.log('✅ Server startup completed successfully');
  
  // Test if server is actually listening
  setTimeout(() => {
    console.log('🔍 Server is still running and responsive');
  }, 2000);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  process.exit(1);
});

server.on('close', () => {
  console.log('🔒 Server closed');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});