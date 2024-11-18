const _ = require('lodash');

const { Failed } = require('../constant');
const { userV, pageableV } = require('../validator');
const { userRE, roleRE } = require('../repository');
const { userM } = require('../mapper');
const { ServiceExc } = require('../exception');

const ensureNotExistedByUsername = async (username) => {
	const isExisted = await userRE.existByUsername(username);
	if (isExisted) {
		const existed = Failed.AlreadyExistedF;
		throw new ServiceExc(existed.msg, existed);
	}
};

const ensureExistedById = async (id) => {
	const old = await userRE.findById(id);
	if (_.isEmpty(old)) {
		const notExisted = Failed.NotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return old;
};

const ensureOwningExistedByIds = async (ids) => {
	const owning = await roleRE.findAllById(ids);
	if (_.isEmpty(owning)) {
		const notExisted = Failed.OwningSideNotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await userV.creationValidate(creation);
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
		const saved = Failed.SaveF;
		throw new ServiceExc(saved.msg, saved);
	}
};

const findById = async (id) => {
	try {
		const queried = await userRE.findById(id);
		if (_.isNull(queried)) {
			const noContent = Failed.FindByIdNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = userM.asResponse(queried);
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
		const { rows: queried, paging } = await userRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = userM.asCollectionResponse(queried);
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

const findAllBy = async ({ page, size, username = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await userRE.findAllBy({ page, size, username });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = userM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await userRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = userM.asCollectionResponse(queried);
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
		await userV.updateValidate(update);
		const old = await ensureExistedById(id);
		await userRE.update(id, update);
		const response = userM.asResponse(old);
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
		old.setRoles([]);
		await userRE.remove(id);
		const response = userM.asResponse(old);
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
