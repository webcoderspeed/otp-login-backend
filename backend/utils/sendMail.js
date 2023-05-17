import nodemailer from 'nodemailer';
import {
	NODEMAILER_EMAIL_HOST,
	NODEMAILER_EMAIL_PASS,
	NODEMAILER_EMAIL_PORT,
	NODEMAILER_EMAIL_USER,
} from '../constants/index.js';

// Create a transporter using the SMTP details of your email provider
const transporter = nodemailer.createTransport({
	host: NODEMAILER_EMAIL_HOST,
	port: NODEMAILER_EMAIL_PORT, // Port may vary, please check with Hostinger's documentation
	secure: false, // Set to true if you're using a secure connection (e.g., TLS)
	auth: {
		user: NODEMAILER_EMAIL_USER,
		pass: NODEMAILER_EMAIL_PASS,
	},
});

const sendMail = async ({ to, subject, html }) => {
	// Define the email options
	const mailOptions = {
		from: `Webcoderspeed<${NODEMAILER_EMAIL_USER}>`,
		to,
		subject,
		html,
	};

	// Send the email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error:', error);
		} else {
			console.log('Email sent:', info.response);
		}
	});
};

export default sendMail;
