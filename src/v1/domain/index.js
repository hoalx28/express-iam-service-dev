const privilege = require('./privilege');
const role = require('./role');
const user = require('./user');
const device = require('./device');
const status = require('./status');
const makeAssociation = require('./association');

makeAssociation(privilege, role, user, device, status);

module.exports = { privilege, role, user, device, status };
