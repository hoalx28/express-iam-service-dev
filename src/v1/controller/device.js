const { deviceS } = require('../service');
const { Success } = require('../constant');
const response = require('../response');

const save = async (req, res, next) => {
	try {
		const { ipAddress, userAgent, userId } = req.body;
		const creation = { ipAddress, userAgent, userId };
		const saved = await deviceS.save(creation);
		response.doSuccess(res, Success.SaveS, saved);
	} catch (error) {
		next(error);
	}
};

const findById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const queried = await deviceS.findById(id);
		response.doSuccess(res, Success.FindByIdS, queried);
	} catch (error) {
		next(error);
	}
};

const findAll = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await deviceS.findAll({ page, size });
		response.doSuccessPaging(res, Success.FindAllS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllBy = async (req, res, next) => {
	try {
		const { page, size, userAgent = '' } = req.query;
		const { response: queried, paging } = await deviceS.findAllBy({ page, size, userAgent });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllArchived = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await deviceS.findAllArchived({ page, size });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { userAgent } = req.body;
		const update = { userAgent };
		const old = await deviceS.update(id, update);
		response.doSuccess(res, Success.UpdateS, old);
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const old = await deviceS.remove(id);
		response.doSuccess(res, Success.DeleteS, old);
	} catch (error) {
		next(error);
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
