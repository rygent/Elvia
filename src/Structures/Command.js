import { PermissionsBitField } from 'discord.js';

export default class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.category = options.category || 'Miscellaneous';
		this.usage = options.usage || '';
		this.memberPermissions = new PermissionsBitField(options.memberPermissions).freeze();
		this.clientPermissions = new PermissionsBitField(options.clientPermissions).freeze();
		this.cooldown = options.cooldown || 3000;
		this.disabled = options.disabled || false;
		this.ownerOnly = options.ownerOnly || false;
		this.nsfw = options.nsfw || false;
	}

	async run(message, args) { // eslint-disable-line no-unused-vars
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}

}
