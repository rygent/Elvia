const { Schema, model: Model } = require('mongoose');

module.exports = class MemberData extends Model {

	constructor() {
		super('Member', new Schema({
			id: { type: String },
			guildId: { type: String },
			registeredAt: { type: Number, default: Date.now() },
			sanctions: { type: Array, default: [] }
		}));
	}

};
