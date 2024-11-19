const Joi = require('joi');

const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const creation = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
	roleIds: Joi.array().items(Joi.number()).required(),
});

const update = Joi.object({
	password: Joi.string(),
});

const whenCreate = async (model) => {
	try {
		await creation.validateAsync(model);
	} catch (error) {
		throw new ServiceExc(Failed.RequestBodyNotReadableF, error.message.replaceAll('"', ''));
	}
};

const whenUpdate = async (model) => {
	try {
		await update.validateAsync(model);
	} catch (error) {
		throw new ServiceExc(Failed.RequestBodyNotReadableF, error.message.replaceAll('"', ''));
	}
};

module.exports = { whenCreate, whenUpdate };
