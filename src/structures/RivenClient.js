const { Client, Collection, Intents } = require('discord.js');
const Util = require('./Util.js');

module.exports = class RivenClient extends Client {

	/* eslint-disable func-names */
	constructor(options) {
		super(options, {
			ws: { intents: Intents.ALL }
		});
		this.commands = new Collection();
		this.aliases = new Collection();
		this.utils = new Util(this);
		this.embed = require('./Embeds.js');
		this.functions = require('./Functions.js');

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};

		Array.prototype.random = function () {
			return this[Math.floor(Math.random() * this.length)];
		};
	}

	/* eslint-disable no-empty-function */
	/* eslint-disable consistent-return */
	async resolveUser(search) {
		let user = null;
		if (!search || typeof search !== 'string') return;
		if (search.match(/^<@!?(\d+)>$/)) {
			const id = search.match(/^<@!?(\d+)>$/)[1];
			user = this.users.fetch(id).catch(() => {});
			if (user) return user;
		}
		if (search.match(/^!?(\w+)#(\d+)$/)) {
			const username = search.match(/^!?(\w+)#(\d+)$/)[0];
			const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
			user = this.users.find((us) => us.username === username && us.discriminator === discriminator);
			if (user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
	}

	// eslint-disable-next-line no-process-env
	async start(token = process.env.TOKEN) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

};
