const { Op } = require('sequelize');

const { status, user } = require('../domain');

const existByContent = async (content) => (await status.count({ paranoid: true, where: { content } })) > 0;

const save = async (model) => await status.create(model);

const findById = async (id) =>
	await status.findByPk(id, {
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
	});

const findAllById = async (ids) => await status.findAll({ where: { id: { [Op.in]: ids } } });

const findAll = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await status.findAndCountAll({
		limit: size,
		offset,
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllBy = async ({ page, size, content = '' }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await status.findAndCountAll({
		limit: size,
		offset,
		where: { content: { [Op.iLike]: `%${content}%` } },
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllArchived = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await status.findAndCountAll({
		limit: size,
		offset,
		where: { deletedAt: { [Op.not]: null } },
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
		paranoid: false,
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const update = async (id, update) => await status.update(update, { where: { id } });

const remove = async (id) => await status.destroy({ where: { id } });

module.exports = {
	existByContent,
	save,
	findById,
	findAllById,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
