const Joi = require('joi');

const { ServiceExc } = require('../exception');
const { Failed } = require('../constant');

const userCreation = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
	roleIds: Joi.array().items(Joi.number()).required(),
});

const userUpdate = Joi.object({
	password: Joi.string(),
});

const creationValidate = async (creation) => {
	try {
		await userCreation.validateAsync(creation);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

const updateValidate = async (update) => {
	try {
		await userUpdate.validateAsync(update);
	} catch (error) {
		const badRequest = Failed.RequestBodyNotReadableF;
		throw new ServiceExc(error.message, badRequest);
	}
};

module.exports = { creationValidate, updateValidate };
