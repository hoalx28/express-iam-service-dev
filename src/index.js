require('dotenv').config();
const express = require('express');

const appCfg = require('./v1/config');

const main = async () => {
	const PORT = process.env.PORT || 8080;
	const app = express();
	await appCfg.dbConfig();
	appCfg.secConfig(app);
	appCfg.parseBodyConfig(app);
	appCfg.routeConfig(app);
	appCfg.recoveryConfig(app);
	app.listen(PORT);
};

main();
