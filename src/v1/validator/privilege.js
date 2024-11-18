const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const privilegeCreation = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
});

const privilegeUpdate = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
});

const creationValidate = async (creation) => {
	try {
		await privilegeCreation.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

const updateValidate = async (update) => {
	try {
		await privilegeUpdate.validateAsync(update);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { creationValidate, updateValidate };
