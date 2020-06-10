const { Client, Collection } = require('discord.js');
const Util = require('./Util.js');

module.exports = class RivenClient extends Client {

	constructor(options = {}) {
		super({
			disableMentions: 'everyone'
		});
		this.validate(options);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.utils = new Util(this);
		this.embed = require('./Embeds.js');
		this.functions = require('./Functions.js');
	}

	async resolveUser(search) {
		let user = null;
		if (!search || typeof search !== 'string') return;
		if (search.match(/^<@!?(\d+)>$/)) {
			const id = search.match(/^<@!?(\d+)>$/)[1];
			// eslint-disable-next-line no-empty-function
			user = this.users.fetch(id).catch(() => {});
			// eslint-disable-next-line consistent-return
			if (user) return user;
		}
		if (search.match(/^!?(\w+)#(\d+)$/)) {
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((us) => us.username === username && us.discriminator === discriminator);
			// eslint-disable-next-line consistent-return
			if (user) return user;
		}
		// eslint-disable-next-line no-empty-function
		user = await this.users.fetch(search).catch(() => {});
		// eslint-disable-next-line consistent-return
		return user;
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.TOKEN = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.PREFIX = options.prefix;
	}

	async start(token = this.TOKEN) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

};
