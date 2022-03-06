const { Permissions } = require('discord.js');

module.exports = class Interaction {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.subCommandGroup = options.subCommandGroup;
		this.subCommand = options.subCommand;
		this.description = options.description || 'No description provided';
		this.memberPermissions = new Permissions(options.memberPermissions).freeze();
		this.clientPermissions = new Permissions(options.clientPermissions).freeze();
		this.guildOnly = options.guildOnly || false;
	}

	// eslint-disable-next-line no-unused-vars
	async run(interaction) {
		throw new Error(`Interaction ${this.name} doesn't provide a run method!`);
	}

};
