const Joi = require('joi');

const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const creation = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	privilegeIds: Joi.array().items(Joi.number()).required(),
});

const update = Joi.object({
	name: Joi.string(),
	description: Joi.string(),
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
