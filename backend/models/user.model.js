import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_TOKEN_EXPIRY } from '../constants/index.js';

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
	user.lastOtpTime = new Date();

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

const User = model('User', userSchema);

export default User;
