import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  getUserProfile, 
  updateUserProgress,
  googleLogin
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/progress', protect, updateUserProgress);

export default router;
