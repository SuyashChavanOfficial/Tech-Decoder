import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  getUserProfile, 
  updateUserProgress,
  googleLogin,
  getMyReferrals,
  getReferralsAll
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.post('/google-login', googleLogin);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/progress', protect, updateUserProgress);
router.get('/referrals/my', protect, getMyReferrals);
router.get('/referrals/all', protect, authorizeRoles('admin'), getReferralsAll);

export default router;
