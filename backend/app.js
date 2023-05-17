import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import chalk from 'chalk';
import connectDB from './config/db.js';
import { PORT } from './constants/index.js';
import { errorHandler, notFound } from './middlewares/error.middlewares.js';
import routes from './routes/index.js';

const app = express();

app.use(morgan('dev'));
dotenv.config();

// setting up body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, async () => {
	console.info(
		chalk.magenta(
			`App is running at port ${PORT} & url http://localhost:${PORT} is live. PID ${process.pid}`,
		),
	);

	await connectDB();


	routes(app);

	app.use(notFound);
	app.use(errorHandler);
});

// terminal close
process.on('SIGINT', function () {
	console.info('Closing the process by user');
	process.exit(0);
});

// system close
process.on('SIGTERM', function () {
	console.info('Closing the process by system');
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	console.info('UNHANDLED EXCEPTION ERROR!!!', err);
	if (err.stack) console.log(err.stack);
});

process.on('unhandledRejection', (err) => {
	console.info('UNHANDLED REJECTION ERROR!!!', err);
	if (err.stack) console.log(err.stack);
});
