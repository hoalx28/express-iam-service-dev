const express = require('express');
const cors = require('cors');

const {
	sequelizeClt: { sequelize },
} = require('../client');
const domains = require('../domain');
const { response } = require('../response');
const { privilegeRO, roleRO, userRO, statusRO, deviceRO } = require('../route');
const { Failed } = require('../constant');
const { ServiceExc } = require('../exception');

const dbConfig = async ({ sync = false }) => {
	try {
		await sequelize.authenticate();
		await sequelize.sync({ alter: sync });
	} catch (error) {
		const DBConfigF = 'can not established connection to database via sequelize.';
		throw new Error(DBConfigF);
	}
};

const secConfig = (app) => {
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cors());
};

const routeConfig = (app) => {
	app.use('/api/v1/privileges', privilegeRO);
	app.use('/api/v1/roles', roleRO);
	app.use('/api/v1/users', userRO);
	app.use('/api/v1/statuses', statusRO);
	app.use('/api/v1/devices', deviceRO);
};

const parseRequestConfig = (app) => {
	app.use((err, req, res, next) => {
		const isBodyNotReadable = err.status == 400;
		if (isBodyNotReadable) {
			const badRequest = Failed.RequestBodyNotReadableF;
			response.doErrorWith(res, badRequest);
			return;
		}
		next(err);
	});
};

const recoveryConfig = (app) => {
	app.use((req, res, next) => {
		const notFound = Failed.NotFoundF;
		response.doErrorWith(res, notFound);
	});
	app.use((err, req, res, next) => {
		if (err instanceof ServiceExc) {
			response.doError(res, err);
			return;
		}
		const uncategorized = Failed.UncategorizedF;
		response.doErrorWith(res, uncategorized);
	});
};

module.exports = { dbConfig, secConfig, parseRequestConfig, routeConfig, recoveryConfig };
