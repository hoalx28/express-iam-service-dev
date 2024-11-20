const express = require('express');
const route = express.Router();

const { authC } = require('../controller');
const {
	authenticationM: { authenticate, jwtAuthenticated },
} = require('../middleware');

route.post('/sign-up', authC.signUp);
route.post('/sign-in', authC.signIn);
route.post('/identity', authC.identity);
route.get('/me', jwtAuthenticated, authC.me);
route.post('/sign-out', authenticate, authC.signOut);
route.post('/refresh', authenticate, authC.refresh);

module.exports = route;
