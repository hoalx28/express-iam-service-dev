const express = require('express');
const route = express.Router();

const { roleC } = require('../controller');

route.post('/', roleC.save);
route.get('/', roleC.findAll);
route.get('/search', roleC.findAllBy);
route.get('/archived', roleC.findAllArchived);
route.get('/:id', roleC.findById);
route.patch('/:id', roleC.update);
route.delete('/:id', roleC.remove);

module.exports = route;
