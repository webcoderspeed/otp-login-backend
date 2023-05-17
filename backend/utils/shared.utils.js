export const checkIsUserBlockedFromLogin = ({ user, response }) => {
	if (user?.attemptBlockTime && user?.attemptBlockTime > Date.now()) {
		const remainingTime = user?.attemptBlockTime - Date.now();
		const secondsRemaining = Math.ceil(remainingTime / 1000);
		const minutesRemaining = Math.floor(secondsRemaining / 60);
		const seconds = secondsRemaining % 60;
		response.status(403);
		throw new Error(
			`Account is blocked for ${user?.email}. Please try again later after ${minutesRemaining}min ${seconds}s`,
		);
	}
};
