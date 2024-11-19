const { Failed } = require('../constant');
const { badCredentialS } = require('../service');
const ServiceExc = require('../exception');

const authenticated = async (req, res, next) => {
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

module.exports = { authenticated };
