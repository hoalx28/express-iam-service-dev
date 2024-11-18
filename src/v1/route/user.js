const express = require('express');
const route = express.Router();

const { userC } = require('../controller');

route.post('/', userC.save);
route.get('/', userC.findAll);
route.get('/search', userC.findAllBy);
route.get('/archived', userC.findAllArchived);
route.get('/:id', userC.findById);
route.patch('/:id', userC.update);
route.delete('/:id', userC.remove);

module.exports = route;
