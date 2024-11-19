const { Op } = require('sequelize');

const { device, user } = require('../domain');

const existByIpAddress = async (ipAddress) => (await device.count({ paranoid: true, where: { ipAddress } })) > 0;

const save = async (model) => await device.create(model);

const findById = async (id) =>
	await device.findByPk(id, {
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
	});

const findByUserId = async (userId) =>
	await device.findOne({
		where: { userId },
		include: {
			model: user,
			attributes: ['username'],
			as: 'user',
		},
	});

const findAllById = async (ids) => await device.findAll({ where: { id: { [Op.in]: ids } } });

const findAll = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await device.findAndCountAll({
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

const findAllBy = async ({ page, size, userAgent = '' }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await device.findAndCountAll({
		limit: size,
		offset,
		where: { userAgent: { [Op.iLike]: `%${userAgent}%` } },
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
	const { rows, count } = await device.findAndCountAll({
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

const update = async (id, update) => await device.update(update, { where: { id } });

const remove = async (id) => await device.destroy({ where: { id } });

module.exports = {
	existByIpAddress,
	save,
	findById,
	findByUserId,
	findAllById,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
