import mongoose from 'mongoose';
const { Schema, model: Model } = mongoose;

export default class extends Model {

	constructor() {
		super('User', new Schema({
			id: { type: String },
			registeredAt: { type: Number, default: Date.now() }
		}));
	}

}
