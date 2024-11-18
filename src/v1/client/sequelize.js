const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRE_DNS);

module.exports = { sequelize, DataTypes };
