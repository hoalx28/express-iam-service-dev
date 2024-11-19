const express = require('express');
const cors = require('cors');

const {
	sequelizeClt: { sequelize },
} = require('./client');
const { privilegeRO, roleRO, userRO, statusRO, deviceRO, authRO } = require('./route');
const { Failed } = require('./constant');
const response = require('./response');
const ServiceExc = require('./exception');

const DBConfigF = 'can not established connection to database via sequelize.';

const dbConfig = async () => {
	try {
		await sequelize.authenticate();
		/**
		 * await sequelize.sync({ alter: true });
		 */
	} catch (error) {
		throw new Error(DBConfigF);
	}
};

const secConfig = (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
};

const parseBodyConfig = (app) => {
	app.use((err, req, res, next) => {
		if (err.status == 400) {
			const bodyNotReadable = Failed.RequestBodyNotReadableF;
			response.doErrorWith(res, bodyNotReadable);
			return;
		}
		next(err);
	});
};

const routeConfig = (app) => {
	app.use('/api/v1/privileges', privilegeRO);
	app.use('/api/v1/roles', roleRO);
	app.use('/api/v1/users', userRO);
	app.use('/api/v1/statuses', statusRO);
	app.use('/api/v1/devices', deviceRO);
	app.use('/api/v1/auth', authRO);
};

const recoveryConfig = (app) => {
	app.use((req, res, next) => {
		response.doErrorWith(res, Failed.NotFoundF);
	});
	app.use((err, req, res, next) => {
		if (err instanceof ServiceExc) {
			response.doError(res, err);
			return;
		}
		response.doErrorWith(res, Failed.UncategorizedF);
	});
};

module.exports = { dbConfig, secConfig, parseBodyConfig, routeConfig, recoveryConfig };
