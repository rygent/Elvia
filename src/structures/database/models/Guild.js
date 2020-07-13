const mongoose = require('mongoose');
const { Schema } = mongoose;
const { prefix } = require('../../Configuration.js');

module.exports = mongoose.model('Guild', new Schema({
	id: { type: String },
	prefix: { type: String, default: prefix }
}));
