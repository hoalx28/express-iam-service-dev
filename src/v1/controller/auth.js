const { Success, Failed } = require('../constant');
const { authS, badCredentialS, userS } = require('../service');
const { jwtProvider } = require('../token');
const response = require('../response');
const ServiceExc = require('../exception');

const signUp = async (req, res, next) => {
	try {
		const { username, password, roleIds } = req.body;
		const request = { username, password, roleIds };
		const credential = await authS.signUp(request);
		response.doSuccess(res, Success.SignUpS, credential);
	} catch (error) {
		next(error);
	}
};

const signIn = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const request = { username, password };
		const credential = await authS.signIn(request);
		response.doSuccess(res, Success.SignInS, credential);
	} catch (error) {
		next(error);
	}
};

const identity = async (req, res, next) => {
	try {
		const header = req.header('Authorization');
		if (!header) {
			throw new ServiceExc(Failed.MissingAuthorizationHeaderF);
		}
		const accessToken = header.replace('Bearer ', '');
		await badCredentialS.ensureNotBadCredential(accessToken);
		response.doSuccess(res, Success.VerifyIdentityS, true);
	} catch (error) {
		next(error);
	}
};

const me = async (req, res, next) => {
	try {
		const { username } = req.user;
		const user = await authS.me(username);
		response.doSuccess(res, Success.RetrieveProfileS, user);
	} catch (error) {
		next(error);
	}
};

const signOut = async (req, res, next) => {
	try {
		const { sessionId: accessTokenId, sessionExpiredAt: accessTokenExpiredAt, userId } = req.user;
		const badCredential = { accessTokenId, accessTokenExpiredAt, userId };
		const sessionId = await authS.signOut(badCredential);
		response.doSuccess(res, Success.SignOutS, sessionId);
	} catch (error) {
		next(error);
	}
};

const refresh = async (req, res, next) => {
	try {
		const header = req.header('X-REFRESH-TOKEN');
		if (!header) {
			response.doErrorWith(res, Failed.MissingAuthorizationHeaderF);
			return;
		}
		const refreshToken = header.replace('Bearer ', '');
		const { sessionId: accessTokenId, sessionExpiredAt: accessTokenExpiredAt, userId, referId } = req.user;
		const badCredential = { accessTokenId, accessTokenExpiredAt, userId };
		const credential = await authS.refresh(badCredential, referId, refreshToken);
		response.doSuccess(res, Success.RefreshTokenS, credential);
	} catch (error) {
		next(error);
	}
};

module.exports = { signUp, signIn, identity, me, signOut, refresh };
