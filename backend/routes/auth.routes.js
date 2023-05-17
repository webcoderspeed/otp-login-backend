import { Router } from 'express';
import * as authControllers from '../controllers/auth.controllers.js';
import * as authValidators from '../validators/auth.validators.js';

const router = Router();

router
	.route('/generate-otp')
	.post(authValidators.validateGenerateOTPRequest, authControllers.generateOTP);

router.post(
	'/otp-login',
	authValidators.validateOTPLoginRequest,
	authControllers.otpLogin,
);

export default router;
