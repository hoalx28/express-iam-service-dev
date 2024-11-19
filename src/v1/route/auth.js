const express = require('express');
const route = express.Router();

const { authC } = require('../controller');
const { authenticationM } = require('../middleware');

route.post('/sign-up', authC.signUp);
route.post('/sign-in', authC.signIn);
route.post('/identity', authC.identity);
route.get('/me', authenticationM.authenticated, authC.me);
route.post('/sign-out', authenticationM.authenticated, authC.signOut);
route.post('/refresh', authenticationM.authenticated, authC.refresh);

module.exports = route;
