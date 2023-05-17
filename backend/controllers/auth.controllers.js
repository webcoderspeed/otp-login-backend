import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc   
 - Generate OTP and mail to user
 - There should be a minimum 1 min gap between two generate OTP requests.
 * @route   POST /api/auth/generate-otp
 * @access  Public
 */
export const generateOTP = asyncHandler(async (req, res, next) => {
	try {
		const { email } = req.body;

		// find user with email
		const userExists = await User.findOne({ email });

		if (!userExists) {
			const user = await User.create({ email });

			// generate otp and mail it back to user
			const otp = await user.generateOTP();
			await user.save();

			return res.status(201).json({
				message: 'Please do check your mail, we have mailed you OTP for login',
				otp,
			});
		}

		const ONE_MIN_DELAY = 60000; // Cooldown time between OTP generation requests in milliseconds -
		if (
			userExists?.lastOtpTime &&
			Date.now() - userExists?.lastOtpTime < ONE_MIN_DELAY
		) {
			const secondsRemaining = Math.ceil(
				(ONE_MIN_DELAY - (Date.now() - userExists?.lastOtpTime)) / 1000,
			);
			res.status(429);

			throw new Error(
				`Too many requests. Please wait : ${secondsRemaining} seconds before requesting new OTP`,
			);
		}

		const otp = await userExists.generateOTP();

		res.status(201).json({
			message: 'Please do check your mail, we have mailed you OTP for login',
			otp,
		});
	} catch (error) {
		next(error);
	}
});
