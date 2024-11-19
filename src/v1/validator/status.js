const Joi = require('joi');

const { Failed } = require('../constant');
const ServiceExc = require('../exception');

const creation = Joi.object({
	content: Joi.string().required(),
	userId: Joi.number().required(),
});

const update = Joi.object({
	content: Joi.string(),
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
		await update.validateAsync(update);
	} catch (error) {
		throw new ServiceExc(Failed.RequestBodyNotReadableF, error.message.replaceAll('"', ''));
	}
};

module.exports = { whenCreate, whenUpdate };
