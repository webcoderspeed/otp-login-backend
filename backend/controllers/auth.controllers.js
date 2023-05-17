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

		// Check if the user's account is blocked [The login can be reattempted only after an hour]
		if (
			userExists?.attemptBlockTime &&
			userExists?.attemptBlockTime > Date.now()
		) {
			const remainingTime = userExists?.attemptBlockTime - Date.now();
			const secondsRemaining = Math.ceil(remainingTime / 1000);
			const minutesRemaining = Math.floor(secondsRemaining / 60);
			const seconds = secondsRemaining % 60;
			res.status(403);
			throw new Error(
				`Account is blocked for ${userExists?.email}. Please try again later after ${minutesRemaining}min ${seconds}s`,
			);
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

/**
 * @desc   
 - Use OTP and return JWT token to user 
 - OTP is valid for 5 minutes only. Not after that.
 - 5 consecutive wrong OTP will block the user account for 1 hour. The login can be reattempted only after an hour.
 - OTP once used can not be reused
 * @route   POST /api/auth/otp-login
 * @access  Public
 */

export const otpLogin = asyncHandler(async (req, res, next) => {
	try {
		const { otp, email } = req.body;

		// find user with email
		const userExists = await User.findOne({ email });

		if (!userExists) {
			res.status(404);
			throw new Error(
				'It seems you have not created a account on our platform. please do create it and then sumbit the OTP along with your registered!',
			);
		}

		// Check if the user's account is blocked [The login can be reattempted only after an hour]
		if (
			userExists?.attemptBlockTime &&
			userExists?.attemptBlockTime > Date.now()
		) {
			const remainingTime = userExists?.attemptBlockTime - Date.now();
			const secondsRemaining = Math.ceil(remainingTime / 1000);
			const minutesRemaining = Math.floor(secondsRemaining / 60);
			const seconds = secondsRemaining % 60;
			res.status(403);
			throw new Error(
				`Account is blocked for ${userExists?.email}. Please try again later after ${minutesRemaining}min ${seconds}s`,
			);
		}

		const FIVE_MIN = 300000;
		// Check if the OTP has expired [ - OTP is valid for 5 minutes only. Not after that.]
		if (Date.now() - userExists?.lastOtpTime > FIVE_MIN) {
			res.status(400);
			throw new Error('OTP has expired!');
		}

		// Check if the provided OTP is correct
		if (otp !== userExists.otp) {
			const errorMessage = await userExists.handleIncorrectOTP();

			if (errorMessage) {
				res.status(403);
				throw new Error(errorMessage);
			}

			res.status(400);
			throw new Error('Invalid OTP!');
		}

		// OTP once used can not be reused
		userExists.otp = undefined;
		await userExists.save();

		// If OTP is valid then generate a new JWT token and send it back to the user
		const accessToken = userExists.generateAccessToken();
		return res.status(201).json({ accessToken });
	} catch (error) {
		next(error);
	}
});
