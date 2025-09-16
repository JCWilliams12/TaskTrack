import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://your-frontend-url.vercel.app', // Replace with your Vercel URL
};
app.use(cors(corsOptions));

// Load environment variables from .env file
dotenv.config();

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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));