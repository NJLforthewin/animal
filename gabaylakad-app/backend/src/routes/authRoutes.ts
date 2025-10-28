import { Router } from 'express';
import { login, register, forgotPassword, resetPassword, verifyEmail, logout, handleRefreshToken, changePassword } from '../controllers/authController';
import { checkEmail, checkPhone, checkSerial } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();



router.post('/login', login);
router.post('/refresh-token', handleRefreshToken);
router.post('/logout', logout);
router.post('/register', register);
router.post('/verify', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/change-password', authenticateToken, changePassword);
router.post('/check-email', checkEmail);
router.post('/check-phone', checkPhone);
router.post('/check-serial', checkSerial);
export default router;