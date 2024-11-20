const { Failed } = require('../constant');
const { badCredentialS } = require('../service');
const ServiceExc = require('../exception');
const passport = require('passport');

const jwtAuthenticated = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user, info) => {
		if (info) {
			next(new ServiceExc(Failed.UnauthorizedF));
		}
		req.user = user;
		next();
	})(req, res, next);
};

const authenticate = async (req, res, next) => {
	try {
		const header = req.header('Authorization');
		if (!header) {
			throw new ServiceExc(Failed.MissingAuthorizationHeaderF);
		}
		const accessToken = header.replace('Bearer ', '');
		const claims = await badCredentialS.ensureNotBadCredential(accessToken);
		req.user = {
			username: claims.sub,
			userId: claims.userId,
			referId: claims.referId,
			sessionId: claims.jti,
			sessionExpiredAt: claims.exp,
			scope: claims.scope,
		};
		next();
	} catch (error) {
		console.log(`Error: ${error.message}`);
		next(error);
	}
};

module.exports = { jwtAuthenticated, authenticate };
