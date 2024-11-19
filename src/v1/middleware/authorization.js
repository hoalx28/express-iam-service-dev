const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const getScope = (req) => {
	const { scope } = req.user;
	if (!scope) {
		throw new ServiceExc(Failed.MissingAuthorizationHeaderF);
	}
	return scope;
};

const hasAuthority = (authority) => (req, res, next) => {
	const scope = getScope(req);
	const isGranted = scope.includes(authority);
	if (!isGranted) {
		throw new ServiceExc(Failed.ForbiddenF);
	}
	next();
};

const hasAnyAuthority = (authorities) => (req, res, next) => {
	let isGranted = false;
	const scope = getScope(req);
	authorities.forEach((authority) => {
		if (scope.includes(authority)) {
			isGranted = true;
		}
	});
	if (!isGranted) {
		throw new ServiceExc(Failed.ForbiddenF);
	}
	next();
};

module.exports = { hasAuthority, hasAnyAuthority };
