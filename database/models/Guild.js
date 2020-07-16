const mongoose = require('mongoose');
const { Schema } = mongoose;
const { prefix } = require('../../src/structures/Configuration.js');

module.exports = mongoose.model('Guild', new Schema({
	id: { type: String },
	membersData: { type: Object, default: {} },
	members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
	prefix: { type: String, default: prefix },
	plugins: { type: Object, default: {
		welcome: {
			enabled: false,
			message: null,
			channel: null,
			withImage: null
		},
		goodbye: {
			enabled: false,
			message: null,
			channel: null,
			withImage: null
		},
		autorole: {
			enabled: false,
			role: null
		},
		automod: {
			enabled: false,
			ignored: []
		},
		warnsSanctions: {
			kick: false,
			ban: false
		},
		suggestions: false,
		modlogs: false,
		reports: false,
		logs: false
	} },
	casesCount: { type: Number, default: 0 },
	ignoredChannels: { type: Array, default: [] },
	autoDeleteModCommands: { type: Boolean, default: false }
}));
