import { Router } from 'express';
import { login, register, forgotPassword, resetPassword, verifyEmail, logout, handleRefreshToken, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();



router.post('/login', login);
router.post('/refresh-token', handleRefreshToken);
router.post('/logout', logout);
router.post('/register', register);
router.post('/verify', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

router.post('/change-password', authenticateToken, changePassword);