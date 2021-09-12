const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	afk: { type: Object, default: {
		enabled: false,
		since: null,
		reason: null
	} },
	reminds: { type: Array, default: [] }
}));
