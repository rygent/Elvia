const { Permissions } = require('discord.js');

module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.category = options.category || 'Miscellaneous';
		this.usage = options.usage || '';
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.clientPerms = new Permissions(options.clientPerms).freeze();
		this.ownerOnly = options.ownerOnly || false;
		this.disabled = options.disabled || false;
		this.nsfw = options.nsfw || false;
		this.cooldown = options.cooldown || 3000;
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}

};
