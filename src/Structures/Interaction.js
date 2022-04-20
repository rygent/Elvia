const { PermissionsBitField } = require('discord.js');

module.exports = class Interaction {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || [name];
		this.description = options.description || 'No description provided';
		this.memberPermissions = new PermissionsBitField(options.memberPermissions).freeze();
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.guildOnly = options.guildOnly || false;
	}

	async run(interaction) { // eslint-disable-line no-unused-vars
		throw new Error(`Interaction ${this.name} doesn't provide a run method!`);
	}

};
