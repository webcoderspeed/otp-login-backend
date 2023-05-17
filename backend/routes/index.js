import authRoutes from './auth.routes.js';

const baseURL = '/api/v1';

const routes = (app) => {
	// app health check
	app.get('/', (req, res, next) =>
		res.status(301).send('Hey this is my API running 🥳'),
	);

	// auth routes
	app.use(`${baseURL}/auth`, authRoutes);
};

export default routes;
