import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { BLOCK_DURATION, JWT_SECRET, JWT_TOKEN_EXPIRY, MAX_WRONG_ATTEMPTS } from '../constants/index.js';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		otp: Number,
		numberOfLoginAttempt: {
			type: Number,
			default: 0,
			required: true,
		},
		lastOtpTime: Date,
		attemptBlockTime: Date,
	},
	{
		timestamps: true,
	},
);
userSchema.methods.generateOTP = async function () {
	const user = this;

	const otp = Math.floor(100000 + Math.random() * 900000);

	user.otp = otp;

	// reseting to default value to allow user for next login attempt
	user.lastOtpTime = new Date();
	user.attemptBlockTime = undefined;
	user.numberOfLoginAttempt = 0

	await user.save();

	return otp;
};

userSchema.methods.generateAccessToken = function () {
	const user = this;

	return jwt.sign(
		{
			id: user._id,
		},
		JWT_SECRET,
		{ expiresIn: JWT_TOKEN_EXPIRY },
	);
};

userSchema.methods.handleIncorrectOTP = async function () {
	const user = this;
	// Increment the wrong OTP attempts counter for the user
	user.numberOfLoginAttempt += 1;
	await user.save();

	if (user?.numberOfLoginAttempt === MAX_WRONG_ATTEMPTS) {
		// Set the account blocking duration [5 consecutive wrong OTP will block the user account for 1 hour.]
		const blockedUntil = Date.now() + BLOCK_DURATION;
		user.attemptBlockTime = blockedUntil
		await user.save();

		return `Account blocked for ${user.email} until ${new Date(blockedUntil)}`;
	}
}


const User = model('User', userSchema);

export default User;
