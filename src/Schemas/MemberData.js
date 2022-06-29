import mongoose from 'mongoose';
const { Schema, model: Model } = mongoose;

export default class extends Model {

	constructor() {
		super('Member', new Schema({
			id: { type: String },
			guildId: { type: String },
			registeredAt: { type: Number, default: Date.now() }
		}));
	}

}
