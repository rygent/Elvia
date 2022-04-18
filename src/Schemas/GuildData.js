const { Schema, model: Model } = require('mongoose');
const { prefix } = require('../Utils/Configuration');

module.exports = class GuildData extends Model {

	constructor() {
		super('Guild', new Schema({
			id: { type: String },
			membersData: { type: Object, default: {} },
			members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
			prefix: { type: String, default: prefix },
			logging: { type: Object, default: {
				moderation: false
			} },
			casesCount: { type: Number, default: 0 }
		}));
	}

};
