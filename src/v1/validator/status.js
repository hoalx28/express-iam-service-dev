const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const statusCreation = Joi.object({
	content: Joi.string().required(),
	userId: Joi.number().required(),
});

const statusUpdate = Joi.object({
	content: Joi.string(),
});

const creationValidate = async (creation) => {
	try {
		await statusCreation.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

const updateValidate = async (update) => {
	try {
		await statusUpdate.validateAsync(update);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { creationValidate, updateValidate };
