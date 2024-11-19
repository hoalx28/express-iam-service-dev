const { statusS } = require('../service');
const { Success } = require('../constant');
const response = require('../response');

const save = async (req, res, next) => {
	try {
		const { content, userId } = req.body;
		const creation = { content, userId };
		const saved = await statusS.save(creation);
		response.doSuccess(res, Success.SaveS, saved);
	} catch (error) {
		next(error);
	}
};

const findById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const queried = await statusS.findById(id);
		response.doSuccess(res, Success.FindByIdS, queried);
	} catch (error) {
		next(error);
	}
};

const findAll = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await statusS.findAll({ page, size });
		response.doSuccessPaging(res, Success.FindAllS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllBy = async (req, res, next) => {
	try {
		const { page, size, content = '' } = req.query;
		const { response: queried, paging } = await statusS.findAllBy({ page, size, content });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllArchived = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await statusS.findAllArchived({ page, size });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { content } = req.body;
		const update = { content };
		const old = await statusS.update(id, update);
		response.doSuccess(res, Success.UpdateS, old);
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const old = await statusS.remove(id);
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
