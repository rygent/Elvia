const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	reminds: { type: Array, default: [] }
}));
