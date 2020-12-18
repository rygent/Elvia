const { APIMessage, Client, Collection, Intents, Message, Permissions } = require('discord.js');
const Util = require('./Util.js');

module.exports = class ElainaClient extends Client {

	/* eslint-disable func-names */
	constructor(options = {}) {
		super({
			disableMentions: 'everyone',
			ws: { intents: Intents.ALL }
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.utils = new Util(this);

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};

		/* eslint-disable camelcase */ // eslint-disable-next-line no-shadow
		Message.prototype.quote = async function (content, options) {
			const reference = {
				message_id: (
					!!content && !options ?
						typeof content === 'object' && content.messageID :
						options && options.messageID
				) || this.id,
				message_channel: this.channel.id
			};

			const { data: parsed, files } = await APIMessage
				.create(this, content, options)
				.resolveData()
				.resolveFiles();

			this.client.api.channels[this.channel.id].messages.post({
				data: { ...parsed, message_reference: reference },
				files
			});
		};
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		if (!options.token) throw new Error('You must pass the token for the client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client');
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();

		if (!options.owner) throw new Error('You must pass a owner id for the client.');
		this.owner = options.owner;
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

};
