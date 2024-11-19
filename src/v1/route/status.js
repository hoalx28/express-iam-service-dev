const express = require('express');
const route = express.Router();

const { statusC } = require('../controller');
const {
	authorizationM: { hasAuthority, hasAnyAuthority },
	authenticationM: { authenticated },
} = require('../middleware');

route.post('/', authenticated, hasAnyAuthority(['UPDATE', 'CREATE']), statusC.save);
route.get('/', statusC.findAll);
route.get('/search', statusC.findAllBy);
route.get('/archived', statusC.findAllArchived);
route.get('/:id', statusC.findById);
route.patch('/:id', statusC.update);
route.delete('/:id', statusC.remove);

module.exports = route;
