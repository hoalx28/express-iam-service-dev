const _ = require('lodash');

const { Failed } = require('../constant');
const { roleV, pageableV } = require('../validator');
const { roleRE, privilegeRE } = require('../repository');
const { roleM } = require('../mapper');
const { ServiceExc } = require('../exception');

const ensureNotExistedByName = async (name) => {
	const isExisted = await roleRE.existByName(name);
	if (isExisted) {
		const existed = Failed.AlreadyExistedF;
		throw new ServiceExc(existed.msg, existed);
	}
};

const ensureExistedById = async (id) => {
	const old = await roleRE.findById(id);
	if (_.isEmpty(old)) {
		const notExisted = Failed.NotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return old;
};

const ensureOwningExistedByIds = async (ids) => {
	const owning = await privilegeRE.findAllById(ids);
	if (_.isEmpty(owning)) {
		const notExisted = Failed.OwningSideNotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await roleV.creationValidate(creation);
		await ensureNotExistedByName(creation.name);
		const owning = await ensureOwningExistedByIds(creation.privilegeIds);
		const saved = await roleRE.save(creation);
		saved.setPrivileges(owning);
		const response = roleM.asResponse(saved);
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
		const queried = await roleRE.findById(id);
		if (_.isNull(queried)) {
			const noContent = Failed.FindByIdNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = roleM.asResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = roleM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAllBy({ page, size, name });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = roleM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = roleM.asCollectionResponse(queried);
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
		await roleV.updateValidate(update);
		const old = await ensureExistedById(id);
		await roleRE.update(id, update);
		const response = roleM.asResponse(old);
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
		old.setPrivileges([]);
		await roleRE.remove(id);
		const response = roleM.asResponse(old);
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
