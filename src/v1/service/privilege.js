const _ = require('lodash');

const { Failed } = require('../constant');
const { privilegeV, pageableV } = require('../validator');
const { privilegeRE } = require('../repository');
const { privilegeM } = require('../mapper');
const ServiceExc = require('../exception');

const ensureNotExistedByName = async (name) => {
	const isExisted = await privilegeRE.existByName(name);
	if (isExisted) {
		throw new ServiceExc(Failed.AlreadyExistedF);
	}
};

const ensureExistedById = async (id) => {
	const old = await privilegeRE.findById(id);
	if (_.isEmpty(old)) {
		throw new ServiceExc(Failed.NotExistedF);
	}
	return old;
};

const save = async (creation) => {
	try {
		await privilegeV.whenCreate(creation);
		await ensureNotExistedByName(creation.name);
		const saved = await privilegeRE.save(creation);
		const response = privilegeM.asResponse(saved);
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
		const queried = await privilegeRE.findById(id);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.FindByIdNoContentF);
		}
		const response = privilegeM.asResponse(queried);
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
		const { rows: queried, paging } = await privilegeRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllNoContentF);
		}
		const response = privilegeM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllF);
	}
};

const findAllBy = async ({ page, size, name = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await privilegeRE.findAllBy({ page, size, name });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = privilegeM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await privilegeRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = privilegeM.asCollectionResponse(queried);
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
		await privilegeV.whenUpdate(update);
		const old = await ensureExistedById(id);
		await privilegeRE.update(id, update);
		const response = privilegeM.asResponse(old);
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
		await privilegeRE.remove(id);
		const response = privilegeM.asResponse(old);
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
