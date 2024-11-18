const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const roleCreation = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	privilegeIds: Joi.array().items(Joi.number()).required(),
});

const roleUpdate = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
});

const creationValidate = async (creation) => {
	try {
		await roleCreation.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

const updateValidate = async (update) => {
	try {
		await roleUpdate.validateAsync(update);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { creationValidate, updateValidate };
