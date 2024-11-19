const privilege = require('./privilege');
const role = require('./role');
const user = require('./user');
const device = require('./device');
const status = require('./status');
const badCredential = require('./bad-credential');
const { doAssociation, doHooks } = require('./setup');

doAssociation(privilege, role, user, device, status);
doHooks(user);

module.exports = { privilege, role, user, device, status, badCredential };
