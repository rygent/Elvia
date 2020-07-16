const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('User', new Schema({
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	afk: { type: String, default: null },
	reminds: { type: Array, default: [] }
}));
