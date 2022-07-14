const { Client, Collection, Permissions } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v9');
const Logger = require('../Modules/Logger');
const Util = require('./Util');
const Database = require('./Database');

module.exports = class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildPresences
			],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			}
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.interactions = new Collection();
		this.events = new Collection();

		this.utils = new Util(this);
		this.logger = new Logger(this);
		this.database = new Database(this);

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
		};

		String.prototype.toSentenceCase = function () {
			return this.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
		};
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		const semver = require('semver/functions/lt');
		if (semver(process.versions.node, '16.6.0')) throw new Error('This client requires Node.js v16.6.0 or higher.');

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners.length) throw new Error('You must pass a list of owners for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owners should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		this.defaultPermissions = new Permissions(options.defaultPermissions).freeze();

		if (!options.mongoURI) throw new Error('You must pass MongoDB URI for the Client.');
		this.mongoURI = options.mongoURI;
	}

	async start(token = this.token) {
		this.database.loadDatabases();
		this.utils.loadCommands();
		this.utils.loadEvents();
		this.utils.loadInteractions();
		super.login(token);
	}

};
