const _ = require('lodash');

const { Failed } = require('../constant');
const { badCredentialRE } = require('../repository');
const { badCredentialM } = require('../mapper');
const { jwtProvider } = require('../auth');

const ServiceExc = require('../exception');

const ensureNotBadCredential = async (token) => {
	try {
		const claims = jwtProvider.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const isBadCredential = await badCredentialRE.existsByAccessTokenId(claims.jti);
		if (isBadCredential) {
			throw new ServiceExc(Failed.TokenBlockedF);
		}
		return claims;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		throw new ServiceExc(Failed.EnsureTokenNotBadCredentialF, error.message);
	}
};

const save = async (creation) => {
	try {
		const saved = await badCredentialRE.save(creation);
		const response = badCredentialM.asResponse(saved);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.SaveF);
	}
};

module.exports = { ensureNotBadCredential, save };
