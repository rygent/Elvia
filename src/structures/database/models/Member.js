const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Member', new Schema({
	id: { type: String },
	guildID: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	sanctions: { type: Array, default: [] },
	mute: { type: Object, default: {
		muted: false,
		case: null,
		endDate: null
	} }

}));
