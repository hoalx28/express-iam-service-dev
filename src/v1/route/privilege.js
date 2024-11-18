const express = require('express');
const route = express.Router();

const { privilegeC } = require('../controller');

route.post('/', privilegeC.save);
route.get('/', privilegeC.findAll);
route.get('/search', privilegeC.findAllBy);
route.get('/archived', privilegeC.findAllArchived);
route.get('/:id', privilegeC.findById);
route.patch('/:id', privilegeC.update);
route.delete('/:id', privilegeC.remove);

module.exports = route;
