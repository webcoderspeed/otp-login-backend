import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_TOKEN_EXPIRY } from '../constants';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		otp: {
			type: Number,
			required: true,
		},
		numberOfLoginAttempt: {
			type: Number,
			default: 0,
			required: true,
		},
		timeOfLoginAttempt: Date,
		otpExpiry: Date,
	},
	{
		timestamps: true,
	},
);
userSchema.methods.generateOTP = async function () {
	const user = this;

	const digits = '0123456789';
	let otp = '';

	for (var i = 0; i < 6; i++) {
		var randomIndex = Math.floor(Math.random() * digits.length);
		otp += digits[randomIndex];
	}

	// setting up otp and otpExpiry
	const ONE_HOUR = 60 * 60 * 1000;
	user.otp = otp;
	user.otpExpiry = new Date(Date.now() + ONE_HOUR);

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
