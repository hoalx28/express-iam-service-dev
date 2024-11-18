function newResponse(code, httpCode, msg, payload) {
	return { timestamp: Date.now(), code, httpCode, msg, payload };
}

function newPagingResponse(code, httpCode, msg, payload, paging) {
	return { timestamp: Date.now(), code, httpCode, msg, payload, paging };
}

const doSuccess = (res, constant, payload) => {
	const response = newResponse(constant.code, constant.httpCode, constant.msg, payload);
	res.status(constant.httpCode);
	res.send(response);
};

const doSuccessPaging = (res, constant, payload, paging) => {
	const response = newPagingResponse(constant.code, constant.httpCode, constant.msg, payload, paging);
	res.status(constant.httpCode);
	res.send(response);
};

const doError = (res, exception) => {
	const failed = exception.failed;
	const response = newResponse(failed.code, failed.httpCode, exception.message);
	res.status(failed.httpCode);
	res.send(response);
};

const doErrorWith = (res, failed) => {
	const response = newResponse(failed.code, failed.httpCode, failed.msg);
	res.status(failed.httpCode);
	res.send(response);
};

module.exports = { doSuccess, doSuccessPaging, doError, doErrorWith };
