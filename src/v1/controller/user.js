const { userS } = require('../service');
const { Success } = require('../constant');
const response = require('../response');

const save = async (req, res, next) => {
	try {
		const { username, password, roleIds } = req.body;
		const creation = { username, password, roleIds };
		const saved = await userS.save(creation);
		response.doSuccess(res, Success.SaveS, saved);
	} catch (error) {
		next(error);
	}
};

const findById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const queried = await userS.findById(id);
		response.doSuccess(res, Success.FindByIdS, queried);
	} catch (error) {
		next(error);
	}
};

const findAll = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await userS.findAll({ page, size });
		response.doSuccessPaging(res, Success.FindAllS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllBy = async (req, res, next) => {
	try {
		const { page, size, username = '' } = req.query;
		const { response: queried, paging } = await userS.findAllBy({ page, size, username });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllArchived = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await userS.findAllArchived({ page, size });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { password } = req.body;
		const update = { password };
		const old = await userS.update(id, update);
		response.doSuccess(res, Success.UpdateS, old);
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const old = await userS.remove(id);
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
