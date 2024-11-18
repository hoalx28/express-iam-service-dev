const { Op } = require('sequelize');

const { user, role, privilege } = require('../domain');

const existByUsername = async (username) => (await user.count({ paranoid: true, where: { username } })) > 0;

const save = async (model) => await user.create(model);

const findById = async (id) =>
	await user.findByPk(id, {
		include: {
			model: role,
			include: {
				model: privilege,
				through: { attributes: [] },
				attributes: ['name', 'description'],
				as: 'privileges',
			},
			through: { attributes: [] },
			attributes: ['name', 'description'],
			as: 'roles',
		},
	});

const findAllById = async (ids) => await user.findAll({ where: { id: { [Op.in]: ids } } });

const findAll = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await user.findAndCountAll({
		limit: size,
		offset,
		include: {
			model: role,
			include: {
				model: privilege,
				through: { attributes: [] },
				attributes: ['name', 'description'],
				as: 'privileges',
			},
			through: { attributes: [] },
			attributes: ['name', 'description'],
			as: 'roles',
		},
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllBy = async ({ page, size, username = '' }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await user.findAndCountAll({
		limit: size,
		offset,
		where: { username: { [Op.iLike]: `%${username}%` } },
		include: {
			model: role,
			include: {
				model: privilege,
				through: { attributes: [] },
				attributes: ['name', 'description'],
				as: 'privileges',
			},
			through: { attributes: [] },
			attributes: ['name', 'description'],
			as: 'roles',
		},
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const findAllArchived = async ({ page, size }) => {
	const offset = (page - 1) * size;
	const { rows, count } = await user.findAndCountAll({
		limit: size,
		offset,
		where: { deletedAt: { [Op.not]: null } },
		include: {
			model: role,
			include: {
				model: privilege,
				through: { attributes: [] },
				attributes: ['name', 'description'],
				as: 'privileges',
			},
			through: { attributes: [] },
			attributes: ['name', 'description'],
			as: 'roles',
		},
		paranoid: false,
	});
	const paging = { page, totalPage: Math.trunc(count / size) + 1, totalRecord: count };
	return { rows, paging };
};

const update = async (id, update) => await user.update(update, { where: { id } });

const remove = async (id) => await user.destroy({ where: { id } });

module.exports = {
	existByUsername,
	save,
	findById,
	findAllById,
	findAll,
	findAllBy,
	findAllArchived,
	update,
	remove,
};
