const { Client, Collection, Intents, Permissions } = require('discord.js');
const Util = require('./Util.js');

module.exports = class BaseClient extends Client {

	constructor(options = {}) {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_PRESENCES
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
		this.cooldowns = new Collection();
		this.utils = new Util(this);

		this.logger = require('../Modules/Logger.js');

		this.usersData = require('../Schemas/UserData.js');
		this.guildsData = require('../Schemas/GuildData.js');
		this.membersData = require('../Schemas/MemberData.js');

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();

		this.databaseCache.mutedUsers = new Collection();

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

	async findOrCreateUser({ id: userId }, isLean) {
		if (this.databaseCache.users.get(userId)) {
			return isLean ? this.databaseCache.users.get(userId).toJSON() : this.databaseCache.users.get(userId);
		} else {
			let userData = isLean ? await this.usersData.findOne({ id: userId }).lean() : await this.usersData.findOne({ id: userId });
			if (userData) {
				if (!isLean) this.databaseCache.users.set(userId, userData);
				return userData;
			} else {
				userData = new this.usersData({ id: userId });
				await userData.save();
				this.databaseCache.users.set(userId, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}

	async findOrCreateGuild({ id: guildId }, isLean) {
		if (this.databaseCache.guilds.get(guildId)) {
			return isLean ? this.databaseCache.guilds.get(guildId).toJSON() : this.databaseCache.guilds.get(guildId);
		} else {
			let guildData = isLean ? await this.guildsData.findOne({ id: guildId }).populate('members').lean() : await this.guildsData.findOne({ id: guildId }).populate('members');
			if (guildData) {
				if (!isLean) this.databaseCache.guilds.set(guildId, guildData);
				return guildData;
			} else {
				guildData = new this.guildsData({ id: guildId });
				await guildData.save();
				this.databaseCache.guilds.set(guildId, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

	async findOrCreateMember({ id: memberId, guildId }, isLean) {
		if (this.databaseCache.members.get(`${memberId}${guildId}`)) {
			return isLean ? this.databaseCache.members.get(`${memberId}${guildId}`).toJSON() : this.databaseCache.members.get(`${memberId}${guildId}`);
		} else {
			let memberData = isLean ? await this.membersData.findOne({ guildId, id: memberId }).lean() : await this.membersData.findOne({ guildId, id: memberId });
			if (memberData) {
				if (!isLean) this.databaseCache.members.set(`${memberId}${guildId}`, memberData);
				return memberData;
			} else {
				memberData = new this.membersData({ id: memberId, guildId: guildId });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildId });
				if (guild) {
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberId}${guildId}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

	validate(options) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

		const nodeVersion = parseFloat(process.versions.node);
		if (nodeVersion < 16.6) throw new Error('This client requires Node.js v16.6.x or higher.');

		if (!options.token) throw new Error('You must pass the token for the Client.');
		this.token = options.token;

		if (!options.prefix) throw new Error('You must pass a prefix for the Client.');
		if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
		this.prefix = options.prefix;

		if (!options.owners) throw new Error('You must pass a list of owners for the Client.');
		if (!Array.isArray(options.owners)) throw new TypeError('Owners should be a type of Array<String>.');
		this.owners = options.owners;

		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the Client.');
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();

		if (!options.mongoURL) throw new Error('You must pass MongoDB URL for the Client.');
		this.mongoURL = options.mongoURL;
	}

	async start(token = this.token) {
		this.utils.loadDatabases();
		this.utils.loadCommands();
		this.utils.loadEvents();
		super.login(token);
	}

};
