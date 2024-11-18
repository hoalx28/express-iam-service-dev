const _ = require('lodash');

const { Failed } = require('../constant');
const { deviceV, pageableV } = require('../validator');
const { deviceRE, userRE } = require('../repository');
const { deviceM } = require('../mapper');
const { ServiceExc } = require('../exception');

const ensureNotExistedByIpAddress = async (ipAddress) => {
	const isExisted = await deviceRE.existByIpAddress(ipAddress);
	if (isExisted) {
		const existed = Failed.AlreadyExistedF;
		throw new ServiceExc(existed.msg, existed);
	}
};

const ensureExistedById = async (id) => {
	const old = await deviceRE.findById(id);
	if (_.isEmpty(old)) {
		const notExisted = Failed.NotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return old;
};

const ensureOwningExistedById = async (id) => {
	const owning = await userRE.findById(id);
	if (_.isNull(owning)) {
		const notExisted = Failed.OwningSideNotExistedF;
		throw new ServiceExc(notExisted.msg, notExisted);
	}
	return owning;
};

const ensureOwningAvailableById = async (owningId) => {
	const owning = await deviceRE.findByUserId(owningId);
	if (!_.isNull(owning)) {
		const notAvailable = Failed.OwningSideNotAvailableF;
		throw new ServiceExc(notAvailable.msg, notAvailable);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await ensureNotExistedByIpAddress(creation.ipAddress);
		const owning = await ensureOwningExistedById(creation.userId);
		await ensureOwningAvailableById(creation.userId);
		const saved = await deviceRE.save(creation);
		saved.setUser(owning);
		const response = deviceM.asResponse(saved);
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
		const queried = await deviceRE.findById(id);
		if (_.isNull(queried)) {
			const noContent = Failed.FindByIdNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = deviceM.asResponse(queried);
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
		const { rows: queried, paging } = await deviceRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = deviceM.asCollectionResponse(queried);
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

const findAllBy = async ({ page, size, content = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await deviceRE.findAllBy({ page, size, content });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = deviceM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await deviceRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			const noContent = Failed.FindAllByNoContentF;
			throw new ServiceExc(noContent.msg, noContent);
		}
		const response = deviceM.asCollectionResponse(queried);
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
		await deviceV.updateValidate(update);
		const old = await ensureExistedById(id);
		await deviceRE.update(id, update);
		const response = deviceM.asResponse(old);
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
		await deviceRE.remove(id);
		const response = deviceM.asResponse(old);
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