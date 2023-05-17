import authRoutes from './auth.routes.js';

const baseURL = '/api/v1';

const routes = (app) => {
	// app health check
	app.get(baseURL, (req, res, next) => res.status(301).json({ app_version: '1.0.0' }));

	// auth routes
	app.use(`${baseURL}/auth`, authRoutes);
};

export default routes;
