import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

// Secure Fallback Pattern: Generate ephemeral keys if not set in environment
export const getSecret = (keyName) => {
  if (process.env[keyName]) {
    return process.env[keyName];
  }
  console.warn(`WARNING: ${keyName} is not set in environment. Generating an ephemeral secret key. This session is instance-isolated!`);
  // Generate secure key and save it in a module-level variable to persist across calls during this process runtime
  if (!global[keyName]) {
    global[keyName] = crypto.randomBytes(32).toString('hex');
  }
  return global[keyName];
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, getSecret('JWT_SECRET'), {
    expiresIn: '15m' // Short-lived access token
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, getSecret('JWT_REFRESH_SECRET'), {
    expiresIn: '7d' // Long-lived refresh token
  });
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, getSecret('JWT_SECRET'));

      // Get user from the token, excluding password
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system.' });
      }

      next();
    } catch (error) {
      console.error('JWT Token verification failed:', error.message);
      // Fail closed
      return res.status(401).json({ message: 'Not authorized, token validation failed.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};
