const makeAssociation = (...args) => {
	const [privilege, role, user, device, status] = args;
	privilege.belongsToMany(role, {
		through: 'privilege_roles',
		foreignKey: 'privilege_id',
		as: 'roles',
	});
	role.belongsToMany(privilege, {
		through: 'privilege_roles',
		foreignKey: 'role_id',
		as: 'privileges',
	});

	role.belongsToMany(user, {
		through: 'role_users',
		foreignKey: 'role_id',
		as: 'users',
	});
	user.belongsToMany(role, {
		through: 'role_users',
		foreignKey: 'user_id',
		as: 'roles',
	});

	user.hasMany(status, { foreignKey: 'user_id', as: 'statuses' });
	status.belongsTo(user, { foreignKey: 'user_id', as: 'user' });

	user.hasOne(device, { foreignKey: 'user_id', as: 'device' });
	device.belongsTo(user, { foreignKey: 'user_id', as: 'user' });
};

module.exports = makeAssociation;
