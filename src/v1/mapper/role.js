const asResponse = (model) => {
	const { deletedAt, createdAt, updatedAt, ...raw } = model.toJSON();
	return raw;
};

const asCollectionResponse = (models) => models.map((v) => asResponse(v));

module.exports = { asResponse, asCollectionResponse };
