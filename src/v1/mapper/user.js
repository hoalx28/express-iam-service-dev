const asResponse = (model) => {
	const raw = model.toJSON();
	delete raw.deletedAt;
	return raw;
};

const asCollectionResponse = (models) => models.map((v) => asResponse(v));

module.exports = { asResponse, asCollectionResponse };
