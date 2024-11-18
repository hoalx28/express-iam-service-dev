const asResponse = (model) => {
	const raw = model.toJSON();
	delete raw.deletedAt;
	delete raw.user_id;
	return raw;
};

const asCollectionResponse = (models) => models.map((v) => asResponse(v));

module.exports = { asResponse, asCollectionResponse };
