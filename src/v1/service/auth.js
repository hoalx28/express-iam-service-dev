const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const { Failed } = require('../constant');
const { authM } = require('../mapper');
const { jwtProvider } = require('../auth');
const ServiceExc = require('../exception');
const userS = require('../service/user');
const badCredentialS = require('./bad-credential');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const accessTokenTimeToLive = process.env.ACCESS_TOKEN_TIME_TO_LIVE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenTimeToLive = process.env.REFRESH_TOKEN_TIME_TO_LIVE;

const newCredential = (user) => {
	const accessTokenId = uuidv4();
	const refreshTokenId = uuidv4();
	const accessToken = jwtProvider.sign(user, accessTokenTimeToLive, accessTokenSecret, accessTokenId, refreshTokenId);
	const refreshToken = jwtProvider.sign(user, refreshTokenTimeToLive, refreshTokenSecret, refreshTokenId, accessTokenId);
	return { accessToken, accessTokenIssuedAt: Date.now(), refreshToken, refreshTokenIssuedAt: Date.now() };
};

// FIXME: JWT Token not include scope in payload in signUp but has in SignIn
const signUp = async (request) => {
	try {
		const creation = authM.asUserCreation(request);
		const user = await userS.save(creation);
		const credential = newCredential(user);
		return credential;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.SignUpF);
	}
};

const signIn = async (request) => {
	try {
		const user = await userS.findByUsername(request.username);
		const isAuthenticated = await bcrypt.compare(request.password, user.password);
		if (!isAuthenticated) {
			throw new ServiceExc(Failed.BadCredentialF);
		}
		const credential = newCredential(user);
		return credential;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			if (error.failed === Failed.NotExistedF) {
				throw new ServiceExc(Failed.BadCredentialF);
			}
			throw error;
		}
		throw new ServiceExc(Failed.SignInF);
	}
};

const identity = async (accessToken) => {
	try {
		const claims = await badCredentialS.ensureNotBadCredential(accessToken);
		return claims;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.VerifiedIdentityF);
	}
};

const me = async (username) => {
	try {
		const queried = await userS.findByUsername(username);
		const user = authM.fromUserResponse(queried);
		return user;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.RetrieveProfileF);
	}
};

const signOut = async (badCredential) => {
	try {
		const saved = await badCredentialS.save(badCredential);
		return saved.id;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.SignOutF);
	}
};

const refresh = async (badCredential, referId, refreshToken) => {
	try {
		const claims = await jwtProvider.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const refreshTokenId = claims.jti;
		if (referId !== refreshTokenId) {
			throw new ServiceExc(Failed.JwtTokenNotSuitableF);
		}
		await badCredentialS.save(badCredential);
		const user = await userS.findById(badCredential.userId);
		const credential = newCredential(user);
		return credential;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.SignOutF);
	}
};

module.exports = { signUp, signIn, identity, me, signOut, refresh };
