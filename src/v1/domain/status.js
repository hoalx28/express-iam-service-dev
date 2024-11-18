const {
	sequelizeClt: { sequelize, DataTypes },
} = require('../client');

const status = sequelize.define(
	'status',
	{
		content: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	},
	{
		tableName: 'statuses',
		paranoid: true,
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
		deletedAt: 'deletedAt',
		underscored: true,
	},
);

module.exports = status;
