require('dotenv').config();
const express = require('express');

const { appCfg } = require('./src/v1/config');

const main = async () => {
	const PORT = process.env.PORT || 8080;
	const app = express();
	await appCfg.dbConfig({ sync: true });
	appCfg.secConfig(app);
	appCfg.parseRequestConfig(app);
	appCfg.routeConfig(app);
	appCfg.recoveryConfig(app);
	app.listen(PORT);
};

main();
