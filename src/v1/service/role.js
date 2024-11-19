const _ = require('lodash');

const { Failed } = require('../constant');
const { roleV, pageableV } = require('../validator');
const { roleRE, privilegeRE } = require('../repository');
const { roleM } = require('../mapper');
const ServiceExc = require('../exception');

const ensureNotExistedByName = async (name) => {
	const isExisted = await roleRE.existByName(name);
	if (isExisted) {
		throw new ServiceExc(Failed.AlreadyExistedF);
	}
};

const ensureExistedById = async (id) => {
	const old = await roleRE.findById(id);
	if (_.isEmpty(old)) {
		throw new ServiceExc(Failed.NotExistedF);
	}
	return old;
};

const ensureOwningExistedByIds = async (ids) => {
	const owning = await privilegeRE.findAllById(ids);
	if (_.isEmpty(owning)) {
		throw new ServiceExc(Failed.OwningSideNotExistedF);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await roleV.whenCreate(creation);
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
		throw new ServiceExc(Failed.SaveF);
	}
};

const findById = async (id) => {
	try {
		const queried = await roleRE.findById(id);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.FindByIdNoContentF);
		}
		const response = roleM.asResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllNoContentF);
		}
		const response = roleM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAllBy({ page, size, name });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = roleM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await roleRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = roleM.asCollectionResponse(queried);
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
		await roleV.whenUpdate(update);
		const old = await ensureExistedById(id);
		await roleRE.update(id, update);
		const response = roleM.asResponse(old);
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
		old.setPrivileges([]);
		await roleRE.remove(id);
		const response = roleM.asResponse(old);
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
