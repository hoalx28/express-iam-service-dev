const { Op } = require('sequelize');

const { privilege } = require('../domain');

const existByName = async (name) => (await privilege.count({ paranoid: true, where: { name } })) > 0;

const save = async (model) => await privilege.create(model);

const findById = async (id) => await privilege.findByPk(id);

const findAllById = async (ids) => await privilege.findAll({ where: { id: { [Op.in]: ids } } });

const findAll = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await privilege.findAndCountAll({ limit: size, offset });
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllBy = async ({ page, size, name = '' }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await privilege.findAndCountAll({
		limit: size,
		offset,
		where: { name: { [Op.iLike]: `%${name}%` } },
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllArchived = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await privilege.findAndCountAll({
		limit: size,
		offset,
		where: { deletedAt: { [Op.not]: null } },
		paranoid: false,
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const update = async (id, update) => await privilege.update(update, { where: { id } });

const remove = async (id) => await privilege.destroy({ where: { id } });

module.exports = {
	existByName,
	save,
	findById,
	findAllById,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
