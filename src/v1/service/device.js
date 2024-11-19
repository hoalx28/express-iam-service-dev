const _ = require('lodash');

const { Failed } = require('../constant');
const { deviceV, pageableV } = require('../validator');
const { deviceRE, userRE } = require('../repository');
const { deviceM } = require('../mapper');
const ServiceExc = require('../exception');

const ensureNotExistedByIpAddress = async (ipAddress) => {
	const isExisted = await deviceRE.existByIpAddress(ipAddress);
	if (isExisted) {
		throw new ServiceExc(Failed.AlreadyExistedF);
	}
};

const ensureExistedById = async (id) => {
	const old = await deviceRE.findById(id);
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

const ensureOwningAvailableById = async (owningId) => {
	const owning = await deviceRE.findByUserId(owningId);
	if (!_.isNull(owning)) {
		throw new ServiceExc(Failed.OwningSideNotAvailableF);
	}
	return owning;
};

const save = async (creation) => {
	try {
		await deviceV.whenCreate(creation);
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
		throw new ServiceExc(Failed.SaveF);
	}
};

const findById = async (id) => {
	try {
		const queried = await deviceRE.findById(id);
		if (_.isNull(queried)) {
			throw new ServiceExc(Failed.FindByIdNoContentF);
		}
		const response = deviceM.asResponse(queried);
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
		const { rows: queried, paging } = await deviceRE.findAll({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllNoContentF);
		}
		const response = deviceM.asCollectionResponse(queried);
		return { response, paging };
	} catch (error) {
		console.log(`Error: ${error.message}`);
		if (error instanceof ServiceExc) {
			throw error;
		}
		throw new ServiceExc(Failed.FindAllF);
	}
};

const findAllBy = async ({ page, size, userAgent = '' }) => {
	try {
		await pageableV.validate({ page, size });
		const { rows: queried, paging } = await deviceRE.findAllBy({ page, size, userAgent });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = deviceM.asCollectionResponse(queried);
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
		const { rows: queried, paging } = await deviceRE.findAllArchived({ page, size });
		if (_.isEmpty(queried)) {
			throw new ServiceExc(Failed.FindAllByNoContentF);
		}
		const response = deviceM.asCollectionResponse(queried);
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
		await deviceV.whenUpdate(update);
		const old = await ensureExistedById(id);
		await deviceRE.update(id, update);
		const response = deviceM.asResponse(old);
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
		await deviceRE.remove(id);
		const response = deviceM.asResponse(old);
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
