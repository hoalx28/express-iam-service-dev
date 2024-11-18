class ServiceExc extends Error {
	constructor(message, failed) {
		super(message);
		this.failed = failed;
	}
}

module.exports = ServiceExc;
