class ServiceExc extends Error {
	constructor(failed, msg = undefined) {
		msg ? super(msg) : super(failed.msg);
		this.failed = failed;
	}
}

module.exports = ServiceExc;
