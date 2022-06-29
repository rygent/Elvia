import mongoose from 'mongoose';
const { Schema, model: Model } = mongoose;

export default class extends Model {

	constructor() {
		super('Guild', new Schema({
			id: { type: String },
			membersData: { type: Object, default: {} },
			members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
			logging: { type: Object, default: {
				moderation: false
			} },
			casesCount: { type: Number, default: 0 }
		}));
	}

}
