import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Referral from '../models/Referral.js';
import { generateAccessToken, generateRefreshToken, getSecret } from '../middleware/authMiddleware.js';
import { calculateReferralCredits } from '../utils/referralMath.js';

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
    const { name, email, password, referralCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All registration fields are required.' });
    }

    // Password validation (length >= 6)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email address already exists.' });
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

      // Handle referral linking if a code is provided
      if (referralCode) {
        try {
          const referrerUser = await User.findOne({ referralCode });
          if (referrerUser) {
            await Referral.create({
              referrer: referrerUser._id,
              referrerName: referrerUser.name,
              referrerEmail: referrerUser.email,
              referrerCode: referralCode,
              referredUser: user._id,
              referredName: user.name,
              referredEmail: user.email,
              type: 'registration'
            });

          }
        } catch (refError) {
          console.error('Failed to link referral during registration:', refError.message);
        }
      }

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
        referralCredits: user.referralCredits,
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

    // Lazily sync real referral count
    const referralsCount = await Referral.countDocuments({ 
      referrer: user._id, 
      type: 'consultation',
      status: { $in: ['successful', 'paid'] } 
    });
    if (user.referrals !== referralsCount) {
      user.referrals = referralsCount;
      user.referralCredits = calculateReferralCredits(referralsCount);
    }

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
      referralCredits: user.referralCredits,
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

// Refresh Access Token endpoint (Verifies and refreshes access tokens)
export const refreshAccessToken = async (req, res) => {
  try {
    const cookies = parseCookies(req);
    const token = cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no refresh token.' });
    }

    // Verify token first to get user ID
    let decoded;
    try {
      decoded = jwt.verify(token, getSecret('JWT_REFRESH_SECRET'));
    } catch (err) {
      // Refresh token is expired or signature is invalid (e.g. server restarted with new ephemeral key)
      res.clearCookie('refreshToken', { 
        path: '/api/auth/refresh', 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      });
      return res.status(401).json({ message: 'Refresh token expired or invalid.' });
    }

    // Find user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Check if the token matches the stored one
    if (user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid session or token mismatch.' });
    }

    // Token is valid: generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    // Note: Reusing the same valid refresh token (30-day life) to prevent StrictMode
    // or tab-concurrency race conditions.
    res.json({ token: newAccessToken });
  } catch (error) {
    console.error('Token refresh failed:', error.message);
    res.status(500).json({ message: 'Server error during token refresh.' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      // Lazily sync real referral count
      const referralsCount = await Referral.countDocuments({ 
        referrer: user._id, 
        type: 'consultation',
        status: { $in: ['successful', 'paid'] } 
      });
      if (user.referrals !== referralsCount) {
        user.referrals = referralsCount;
        user.referralCredits = calculateReferralCredits(referralsCount);
        await user.save();
      }
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
    const { token, referralCode } = req.body;

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
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
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

    // Handle referral linking for new Google user registrations
    if (isNewUser && referralCode) {
      try {
        const referrerUser = await User.findOne({ referralCode });
        if (referrerUser) {
          await Referral.create({
            referrer: referrerUser._id,
            referrerName: referrerUser.name,
            referrerEmail: referrerUser.email,
            referrerCode: referralCode,
            referredUser: user._id,
            referredName: user.name,
            referredEmail: user.email,
            type: 'registration'
          });

        }
      } catch (refError) {
        console.error('Failed to link referral during Google registration:', refError.message);
      }
    }

    // Lazily sync real referral count
    const referralsCount = await Referral.countDocuments({ 
      referrer: user._id, 
      type: 'consultation',
      status: { $in: ['successful', 'paid'] } 
    });
    if (user.referrals !== referralsCount) {
      user.referrals = referralsCount;
      user.referralCredits = calculateReferralCredits(referralsCount);
      await user.save();
    }

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
      referralCredits: user.referralCredits,
      referralCode: user.referralCode,
      uploadedFiles: user.uploadedFiles,
      token: accessToken
    });
  } catch (error) {
    console.error('Google login failed:', error.message);
    res.status(400).json({ message: 'Google authentication validation failed.' });
  }
};

// Get referrals initiated by the logged-in user
export const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .select('referredName referredEmail type status rewardAmount createdAt')
      .sort({ createdAt: -1 });
    res.json(referrals);
  } catch (error) {
    console.error('Fetch my referrals failed:', error.message);
    res.status(500).json({ message: 'Server error fetching referrals.' });
  }
};

// Admin only: Get all referral transactions in the system for tracking spendings
export const getReferralsAll = async (req, res) => {
  try {
    const referrals = await Referral.find({})
      .sort({ createdAt: -1 });
    res.json(referrals);
  } catch (error) {
    console.error('Fetch all referrals failed:', error.message);
    res.status(500).json({ message: 'Server error fetching all referral tracking data.' });
  }
};

// Admin only: Update referral status and add comment/history
export const updateReferralStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    if (!status || !comment) {
      return res.status(400).json({ message: 'Status and comment/reason are required.' });
    }

    const referral = await Referral.findById(id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral record not found.' });
    }

    // Append to status history
    referral.statusHistory.push({
      status,
      comment,
      updatedAt: new Date()
    });

    // Update current status
    referral.status = status;
    await referral.save();

    // Sync referrer's referral count
    if (referral.referrer) {
      const count = await Referral.countDocuments({ 
        referrer: referral.referrer, 
        type: 'consultation',
        status: { $in: ['successful', 'paid'] } 
      });
      await User.findByIdAndUpdate(referral.referrer, { 
        referrals: count,
        referralCredits: calculateReferralCredits(count)
      });
    }

    res.json(referral);
  } catch (error) {
    console.error('Update referral status failed:', error.message);
    res.status(500).json({ message: 'Server error updating referral status.' });
  }
};

// Admin only: Get all users on the platform
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -refreshToken').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Fetch all users failed:', error.message);
    res.status(500).json({ message: 'Server error fetching all users.' });
  }
};

// Admin only: Update a user's role and domain
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, domain } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required.' });
    }

    const validRoles = ['student', 'developer', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selection.' });
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userToUpdate.role = role;
    if (domain !== undefined) {
      userToUpdate.domain = domain;
    }

    // Student domain must always be empty string
    if (role === 'student') {
      userToUpdate.domain = '';
    }

    await userToUpdate.save();
    res.json({ message: 'User role updated successfully.', user: userToUpdate });
  } catch (error) {
    console.error('Update user role failed:', error.message);
    res.status(500).json({ message: 'Server error updating user role.' });
  }
};
