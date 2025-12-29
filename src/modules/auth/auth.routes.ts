import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

import { authenticate } from '../../middlewares/auth.middleware';
import { verifyCaptcha } from '../../middlewares/captcha.middleware';

router.post('/register', verifyCaptcha, authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// MFA Routes
router.post('/mfa/generate', authenticate, authController.generateMfa);
router.post('/mfa/verify', authenticate, authController.verifyMfa);

export const authRoutes = router;
