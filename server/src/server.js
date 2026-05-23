import express from 'express';
import https from 'https';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers to avoid standard attacks

// Configure CORS securely
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Blocked by CORS policy: origin not allowed.'));
    }
  },
  credentials: true, // Allow cookies to be sent across origins (crucial for HttpOnly refresh tokens)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10kb' })); // Mitigate DoS by restricting request body size

// Health check endpoint (used for self-ping to keep Render free instance alive)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/consultations', consultationRoutes);

// Generic Error Handler (Fail Closed, avoid exposing DB logs to client)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'A server error occurred. Please try again later.' });
});

// Run server on 127.0.0.1 for secure local testing (avoid 0.0.0.0), but use 0.0.0.0 for Render (production)
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://${HOST}:${PORT}`);

  // Self-ping to prevent Render free tier from spinning down (runs only in production)
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
    setInterval(() => {
      const url = `${process.env.RENDER_EXTERNAL_URL}/health`;
      https.get(url, (res) => {
        console.log(`[Keep-Alive] Pinged ${url} — status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.warn(`[Keep-Alive] Ping failed: ${err.message}`);
      });
    }, PING_INTERVAL_MS);
    console.log('[Keep-Alive] Self-ping scheduler started.');
  }
});
export default server;
