const Joi = require('joi');

const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const pageable = Joi.object({
	page: Joi.number().min(1).required(),
	size: Joi.number().min(5).max(50).required(),
});

const validate = async (creation) => {
	try {
		await pageable.validateAsync(creation);
	} catch (error) {
		throw new ServiceExc(Failed.RequestParamsNotReadableF, error.message.replaceAll('"', ''));
	}
};

module.exports = { validate };
