const express = require('express');
const route = express.Router();

const { deviceC } = require('../controller');

route.post('/', deviceC.save);
route.get('/', deviceC.findAll);
route.get('/search', deviceC.findAllBy);
route.get('/archived', deviceC.findAllArchived);
route.get('/:id', deviceC.findById);
route.patch('/:id', deviceC.update);
route.delete('/:id', deviceC.remove);

module.exports = route;
