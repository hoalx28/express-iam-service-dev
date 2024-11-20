const jwt = require('jsonwebtoken');

const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const buildScope = (user) => {
	const scope = [];
	user?.roles?.forEach((r) => {
		scope.push(`ROLE_${r.name}`);
		r?.privileges?.forEach((p) => scope.push(p.name));
	});
	return scope.join(' ');
};

const sign = (user, expiredTime, secretKey, id, referId) => {
	const payload = { userId: user?.id, scope: buildScope(user), referId };
	return jwt.sign(payload, secretKey, { expiresIn: expiredTime, jwtid: id, subject: user?.username });
};

const verify = (token, secretKey) => {
	try {
		return jwt.verify(token, secretKey);
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error.name === 'TokenExpiredError') {
			throw new ServiceExc(Failed.JwtTokenExpiredF);
		}
		throw new ServiceExc(Failed.IllLegalJwtTokenF);
	}
};

module.exports = { buildScope, sign, verify };
