const _ = require('lodash');

const { Failed } = require('../constant');
const { privilegeV, pageableV } = require('../validator');
const { privilegeRE } = require('../repository');
const { privilegeM } = require('../mapper');
const { ServiceExc } = require('../exception');

const ensureNotExistedByName = async (name) => {
	const isExisted = await privilegeRE.existByName(name);
	if (isExisted) {
		const existed = Failed.AlreadyExistedF;
		throw new ServiceExc(existed.msg, existed);
	}
};

const ensureExistedById = async (id) => {
	const old = await privilegeRE.findById(id);
	if (_.isEmpty(old)) {
		const notExisted = Failed.NotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return old;
};

const save = async (creation) => {
	try {
		await privilegeV.creationValidate(creation);
		await ensureNotExistedByName(creation.name);
		const saved = await privilegeRE.save(creation);
		const response = privilegeM.asResponse(saved);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const saved = Failed.SaveF;
		throw new ServiceExc(saved.msg, saved);
	}
};

const findById = async (id) => {
	try {
		const queried = await privilegeRE.findById(id);
		if (_.isNull(queried)) {
			const noContent = Failed.FindByIdNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = privilegeM.asResponse(queried);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const queried = Failed.FindByIdF;
		throw new ServiceExc(queried.msg, queried);
	}
};

const findAll = async ({ page, size }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await privilegeRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = privilegeM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const queried = Failed.FindAllF;
		throw new ServiceExc(queried.msg, queried);
	}
};

const findAllBy = async ({ page, size, name = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await privilegeRE.findAllBy({ page, size, name });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = privilegeM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const queried = Failed.FindAllByF;
		throw new ServiceExc(queried.msg, queried);
	}
};

const findAllArchived = async ({ page, size }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await privilegeRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = privilegeM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const queried = Failed.FindAllArchivedF;
		throw new ServiceExc(queried.msg, queried);
	}
};

const update = async (id, update) => {
	try {
		await privilegeV.updateValidate(update);
		const old = await ensureExistedById(id);
		await privilegeRE.update(id, update);
		const response = privilegeM.asResponse(old);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		const queried = Failed.UpdateF;
		throw new ServiceExc(queried.msg, queried);
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
		const queried = Failed.DeleteF;
		throw new ServiceExc(queried.msg, queried);
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
