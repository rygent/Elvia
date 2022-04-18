const { Schema, model: Model } = require('mongoose');

module.exports = class UserData extends Model {

	constructor() {
		super('User', new Schema({
			id: { type: String },
			registeredAt: { type: Number, default: Date.now() }
		}));
	}

};
