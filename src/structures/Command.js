module.exports = class Command {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description provided.';
		this.category = options.category || 'Miscellaneous';
		this.usage = `${this.client.prefix}${this.name} ${options.usage || ''}`.trim();
		this.memberPerms = options.memberPerms || [];
		this.clientPerms = options.clientPerms || [];
		this.nsfw = options.nsfw || false;
		this.ownerOnly = options.ownerOnly || false;
		this.cooldown = options.cooldown || 3000;
	}

	// eslint-disable-next-line no-unused-vars
	async run(message, args) {
		throw new Error(`Command ${this.name} doesn't provide a run method!`);
	}

};
