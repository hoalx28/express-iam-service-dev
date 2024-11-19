const _ = require('lodash');

const { Failed } = require('../constant');
const { userV, pageableV } = require('../validator');
const { userRE, roleRE } = require('../repository');
const { userM } = require('../mapper');
const ServiceExc = require('../exception');

const ensureNotExistedByUsername = async (username) => {
	const isExisted = await userRE.existByUsername(username);
	if (isExisted) {
		throw new ServiceExc(Failed.AlreadyExistedF);
	}
};

const ensureExistedById = async (id) => {
	const old = await userRE.findById(id);
	if (_.isEmpty(old)) {
		throw new ServiceExc(Failed.NotExistedF);
	}
	return old;
};

const ensureOwningExistedByIds = async (ids) => {
	const owning = await roleRE.findAllById(ids);
	if (_.isEmpty(owning)) {
		throw new ServiceExc(Failed.OwningSideNotExistedF);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await userV.whenCreate(creation);
		await ensureNotExistedByUsername(creation.username);
		const owning = await ensureOwningExistedByIds(creation.roleIds);
		const saved = await userRE.save(creation);
		saved.setRoles(owning);
		const response = userM.asResponse(saved);
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
		const queried = await userRE.findById(id);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.FindByIdNoContentF);
		}
		const response = userM.asResponse(queried);
		return response;
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindByIdF);
	}
};

const findByUsername = async (username) => {
	try {
		const queried = await userRE.findByUsername(username);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.NotExistedF);
		}
		const response = userM.asResponse(queried);
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
		const { rows: queried, paging } = await userRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllNoContentF);
		}
		const response = userM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllF);
	}
};

const findAllBy = async ({ page, size, username = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await userRE.findAllBy({ page, size, username });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = userM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await userRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = userM.asCollectionResponse(queried);
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
		await userV.whenUpdate(update);
		const old = await ensureExistedById(id);
		await userRE.update(id, update);
		const response = userM.asResponse(old);
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
		old.setRoles([]);
		await userRE.remove(id);
		const response = userM.asResponse(old);
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
	findByUsername,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
