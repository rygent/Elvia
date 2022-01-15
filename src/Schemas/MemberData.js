const { Schema, model } = require('mongoose');

module.exports = model('Member', new Schema({
	id: { type: String },
	guildId: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	sanctions: { type: Array, default: [] }

}));
