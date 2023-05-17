import joi from 'joi';

export const validateGenerateOTPRequest = (req, res, next) => {
	const schema = joi.object({
		email: joi
			.string()
			.email()
			.required()
			.error(Error('Please enter a valid email!')),
	});

	const { error } = schema.validate(req.body);

	if (error) next(error);

	next();
};

export const validateOTPLoginRequest = (req, res, next) => {
	const schema = joi.object({
		otp: joi.number().required().error(Error('Please enter a valid otp!')),
		email: joi
			.string()
			.email()
			.required()
			.error(Error('Please enter a valid email!')),
	});

	const { error } = schema.validate(req.body);

	if (error) next(error);

	next();
};
