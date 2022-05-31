const { Client, Collection, Partials, PermissionsBitField } = require('discord.js');
const { GatewayIntentBits } = require('discord-api-types/v10');
const { Secrets } = require('../Utils/Constants');
const Logger = require('../Utils/Logger');
const Util = require('./Util');
const Database = require('./Database');
const semver = require('semver');

module.exports = class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildBans,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			],
			partials: [
				Partials.Channel
			],
			allowedMentions: {
				parse: ['users', 'roles'],
				repliedUser: false
			}
		});
		this.logger = new Logger(this, { depth: 5 });
		this.validate(options);

		this.interactions = new Collection();
		this.commands = new Collection();
		this.aliases = new Collection();
		this.events = new Collection();
		this.cooldown = new Collection();

		this.utils = new Util(this);
		this.db = new Database(this);

		String.prototype.toTitleCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
		};

		String.prototype.toSentenceCase = function () {
			return this.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (semver.lt(process.versions.node, '16.9.0')) throw new Error('This client requires Node.JS v16.9.0 or higher.');
		this.debug = options.debug;

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners.length) throw new Error('You must pass a list of owner(s) for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owner(s) should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPermissions.length) throw new Error('You must pass default permission(s) for the Client.');
		if (!Array.isArray(options.defaultPermissions)) throw new TypeError('Permission(s) should be a type of Array<String>.');
		this.defaultPermissions = new PermissionsBitField(options.defaultPermissions).freeze();

		if (!options.mongodb) throw new Error('You must pass MongoDB URI for the Client.');
		this.mongodb = options.mongodb;

		if (!Secrets.ImdbApiKey) this.logger.warn('You must pass IMDb API Key to use "imdb" Command.');
		if (!Secrets.ImgurClientId) this.logger.warn('You must pass Imgur Client ID to use "imgur" Command.');
		if (!Secrets.OpenWeatherApiKey) this.logger.warn('You must pass OpenWeather API Key to use "weather" Command.');
		if (!Secrets.SpotifyClientId || !Secrets.SpotifyClientSecret) this.logger.warn('You must pass Spotify Client ID & Secret to use "spotify" Command.');
	}

	async start(token = this.token) {
		this.utils.loadInteractions();
		this.utils.loadCommands();
		this.utils.loadEvents();
		this.db.loadDatabases();
		super.login(token);
	}

};
