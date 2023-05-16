import mongoose from 'mongoose';
import chalk from 'chalk';
import { MONGO_DB_URI } from '../constants/index.js';

const connected = chalk.bold.cyan;
const error = chalk.bold.yellow;
const disconnected = chalk.bold.red;
const termination = chalk.bold.magenta;

const connectDB = async () => {
	mongoose.set('strictQuery', true);
	const mongoParams = {
		uri: MONGO_DB_URI,
		options: {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			maxPoolSize: 10,
		},
	};

	mongoose.connect(mongoParams.uri, mongoParams.options);

	mongoose.connection.on('connected', function () {
		console.info(connected(`Mongodb connection is open ${mongoParams.uri}`));
	});

	mongoose.connection.on('error', function (err) {
		console.info(error(`Mongodb connection error ${err}`));
	});

	mongoose.connection.on('disconnected', function () {
		console.info(disconnected('Mongodb connection is disconnected'));
	});

	process.on('SIGINT', function () {
		mongoose.connection.close(function () {
			console.info(
				termination(
					'Mongoose connection disconnected due to application termination',
				),
			);
			process.exit(0);
		});
	});
};

export default connectDB;
