const _ = require('lodash');

const { Failed } = require('../constant');
const { statusV, pageableV } = require('../validator');
const { statusRE, userRE } = require('../repository');
const { statusM } = require('../mapper');
const ServiceExc = require('../exception');

const ensureNotExistedByContent = async (content) => {
	const isExisted = await statusRE.existByContent(content);
	if (isExisted) {
		throw new ServiceExc(Failed.AlreadyExistedF);
	}
};

const ensureExistedById = async (id) => {
	const old = await statusRE.findById(id);
	if (_.isEmpty(old)) {
		throw new ServiceExc(Failed.NotExistedF);
	}
	return old;
};

const ensureOwningExistedById = async (id) => {
	const owning = await userRE.findById(id);
	if (_.isNull(owning)) {
		throw new ServiceExc(Failed.OwningSideNotExistedF);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await statusV.whenCreate(creation);
		await ensureNotExistedByContent(creation.content);
		const owning = await ensureOwningExistedById(creation.userId);
		const saved = await statusRE.save(creation);
		saved.setUser(owning);
		const response = statusM.asResponse(saved);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.SaveF);
	}
};

const findById = async (id) => {
	try {
		const queried = await statusRE.findById(id);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.FindByIdNoContentF);
		}
		const response = statusM.asResponse(queried);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindByIdF);
	}
};

const findAll = async ({ page, size }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await statusRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllNoContentF);
		}
		const response = statusM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllF);
	}
};

const findAllBy = async ({ page, size, content = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await statusRE.findAllBy({ page, size, content });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = statusM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllByF);
	}
};

const findAllArchived = async ({ page, size }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await statusRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = statusM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllArchivedF);
	}
};

const update = async (id, update) => {
	try {
		await statusV.whenUpdate(update);
		const old = await ensureExistedById(id);
		await statusRE.update(id, update);
		const response = statusM.asResponse(old);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.UpdateF);
	}
};

const remove = async (id) => {
	try {
		const old = await ensureExistedById(id);
		await statusRE.remove(id);
		const response = statusM.asResponse(old);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.DeleteF);
	}
};

module.exports = {
	save,
	findById,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
