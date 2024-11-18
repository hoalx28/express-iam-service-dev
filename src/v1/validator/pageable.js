const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const pageable = Joi.object({
	page: Joi.number().min(1).required(),
	size: Joi.number().min(5).max(50).required(),
});

const validate = async (creation) => {
	try {
		await pageable.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestParamsNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { validate };
