import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, getSecret } from '../middleware/authMiddleware.js';

// Helper to parse cookies from request headers
const parseCookies = (req) => {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name.trim();
    if (!name) return;
    const val = rest.join('=').trim();
    list[name] = decodeURIComponent(val);
  });

  return list;
};

// Set refresh token in HTTP-only cookie
const setRefreshTokenCookie = (res, token) => {
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days — matches JWT expiry
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin on Render
    maxAge: maxAge,
    path: '/api/auth/refresh'
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All registration fields are required.' });
    }

    // Password validation (length >= 8)
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists in the system.' });
    }

    // Hash password (12 salt rounds)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      // Send refresh token in secure cookie
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        domain: user.domain,
        avatar: user.avatar,
        modulesCompleted: user.modulesCompleted,
        checklist: user.checklist,
        referrals: user.referrals,
        referralCode: user.referralCode,
        uploadedFiles: user.uploadedFiles,
        token: accessToken
      });
    } else {
      res.status(400).json({ message: 'Failed to create user.' });
    }
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      domain: user.domain,
      avatar: user.avatar,
      modulesCompleted: user.modulesCompleted,
      checklist: user.checklist,
      referrals: user.referrals,
      referralCode: user.referralCode,
      uploadedFiles: user.uploadedFiles,
      token: accessToken
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const cookies = parseCookies(req);
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
      // Find user and remove refresh token
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = '';
        await user.save();
      }
    }

    // Clear refresh cookie
    res.clearCookie('refreshToken', {
      path: '/api/auth/refresh',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout failed:', error.message);
    res.status(500).json({ message: 'Server error during logout.' });
  }
};

// Refresh Access Token endpoint (Rotates Refresh Tokens)
export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = parseCookies(req);
    const token = cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no refresh token.' });
    }

    // Find user with this token
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ message: 'Token reuse or invalid session.' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));
      
      // Token is valid: rotate token
      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      await user.save();

      setRefreshTokenCookie(res, newRefreshToken);
      res.json({ token: newAccessToken });
    } catch (err) {
      // Token expired or invalid
      user.refreshToken = '';
      await user.save();
      res.clearCookie('refreshToken', { 
        path: '/api/auth/refresh', 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      return res.status(401).json({ message: 'Refresh token expired or invalid.' });
    }
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    res.status(500).json({ message: 'Server error during token refresh.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Fetch profile failed:', error.message);
    res.status(500).json({ message: 'Server error fetching user profile.' });
  }
};

// Update user tasks checklist and progress stats
export const updateUserProgress = async (req, res) => {
  try {
    const { checklist, modulesCompleted, uploadedFiles, referrals } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update progress variables securely
    if (checklist !== undefined) user.checklist = checklist;
    if (modulesCompleted !== undefined) user.modulesCompleted = modulesCompleted;
    if (uploadedFiles !== undefined) user.uploadedFiles = uploadedFiles;
    if (referrals !== undefined) user.referrals = referrals;

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      domain: updatedUser.domain,
      avatar: updatedUser.avatar,
      modulesCompleted: updatedUser.modulesCompleted,
      checklist: updatedUser.checklist,
      referrals: updatedUser.referrals,
      referralCode: updatedUser.referralCode,
      uploadedFiles: updatedUser.uploadedFiles
    });
  } catch (error) {
    console.error('Progress sync failed:', error.message);
    res.status(500).json({ message: 'Server error updating user metrics.' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google credential token is required.' });
    }

    const clientId = getSecret('GOOGLE_CLIENT_ID');
    const oAuthClient = new OAuth2Client(clientId);

    const ticket = await oAuthClient.verifyIdToken({
      idToken: token,
      audience: clientId
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account has no associated email.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create user with Google login details and random password
      const dummyPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(dummyPassword, salt);

      user = await User.create({
        name: name || 'Google User',
        email,
        password: hashedPassword,
        avatar: picture || undefined
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      domain: user.domain,
      avatar: user.avatar,
      modulesCompleted: user.modulesCompleted,
      checklist: user.checklist,
      referrals: user.referrals,
      referralCode: user.referralCode,
      uploadedFiles: user.uploadedFiles,
      token: accessToken
    });
  } catch (error) {
    console.error('Google login failed:', error.message);
    res.status(400).json({ message: 'Google authentication validation failed.' });
  }
};
