const { roleS } = require('../service');
const { Success } = require('../constant');
const response = require('../response');

const save = async (req, res, next) => {
	try {
		const { name, description, privilegeIds } = req.body;
		const creation = { name, description, privilegeIds };
		const saved = await roleS.save(creation);
		response.doSuccess(res, Success.SaveS, saved);
	} catch (error) {
		next(error);
	}
};

const findById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const queried = await roleS.findById(id);
		response.doSuccess(res, Success.FindByIdS, queried);
	} catch (error) {
		next(error);
	}
};

const findAll = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await roleS.findAll({ page, size });
		response.doSuccessPaging(res, Success.FindAllS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllBy = async (req, res, next) => {
	try {
		const { page, size, name = '' } = req.query;
		const { response: queried, paging } = await roleS.findAllBy({ page, size, name });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const findAllArchived = async (req, res, next) => {
	try {
		const { page, size } = req.query;
		const { response: queried, paging } = await roleS.findAllArchived({ page, size });
		response.doSuccessPaging(res, Success.FindAllByS, queried, paging);
	} catch (error) {
		next(error);
	}
};

const update = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, description } = req.body;
		const update = { name, description };
		const old = await roleS.update(id, update);
		response.doSuccess(res, Success.UpdateS, old);
	} catch (error) {
		next(error);
	}
};

const remove = async (req, res, next) => {
	try {
		const { id } = req.params;
		const old = await roleS.remove(id);
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
