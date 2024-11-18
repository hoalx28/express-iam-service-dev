const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const deviceCreation = Joi.object({
	userAgent: Joi.string().required(),
	ipAddress: Joi.string().required(),
	userId: Joi.number().required(),
});

const deviceUpdate = Joi.object({
	userAgent: Joi.string(),
	ipAddress: Joi.string(),
});

const creationValidate = async (creation) => {
	try {
		await deviceCreation.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

const updateValidate = async (update) => {
	try {
		await deviceUpdate.validateAsync(update);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { creationValidate, updateValidate };
