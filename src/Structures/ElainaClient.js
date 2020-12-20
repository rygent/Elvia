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
		this.cooldowns = new Collection();
		this.utils = new Util(this);

		this.database = new (require('./ElainaDatabase.js'));

		this.usersData = require('../Schemas/UserData.js');
		this.guildsData = require('../Schemas/GuildData.js');
		this.membersData = require('../Schemas/MemberData');

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();

		String.prototype.toProperCase = function () {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		Number.prototype.formatNumber = function () {
			return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
		};

		Array.prototype.random = function () {
			return this[Math.floor(Math.random() * this.length)];
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

	async findOrCreateUser({ id: userID }, isLean) {
		if (this.databaseCache.users.get(userID)) {
			return isLean ? this.databaseCache.users.get(userID).toJSON() : this.databaseCache.users.get(userID);
		} else {
			let userData = isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID });
			if (userData) {
				if (!isLean) this.databaseCache.users.set(userID, userData);
				return userData;
			} else { // eslint-disable-next-line new-cap
				userData = new this.usersData({ id: userID });
				await userData.save();
				this.databaseCache.users.set(userID, userData);
				return isLean ? userData.toJSON() : userData;
			}
		}
	}

	async findOrCreateGuild({ id: guildID }, isLean) {
		if (this.databaseCache.guilds.get(guildID)) {
			return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
		} else {
			let guildData = isLean ? await this.guildsData.findOne({ id: guildID }).populate('members').lean() : await this.guildsData.findOne({ id: guildID }).populate('members');
			if (guildData) {
				if (!isLean) this.databaseCache.guilds.set(guildID, guildData);
				return guildData;
			} else { // eslint-disable-next-line new-cap
				guildData = new this.guildsData({ id: guildID });
				await guildData.save();
				this.databaseCache.guilds.set(guildID, guildData);
				return isLean ? guildData.toJSON() : guildData;
			}
		}
	}

	async findOrCreateMember({ id: memberID, guildID }, isLean) {
		if (this.databaseCache.members.get(`${memberID}${guildID}`)) {
			return isLean ? this.databaseCache.members.get(`${memberID}${guildID}`).toJSON() : this.databaseCache.members.get(`${memberID}${guildID}`);
		} else {
			let memberData = isLean ? await this.membersData.findOne({ guildID, id: memberID }).lean() : await this.membersData.findOne({ guildID, id: memberID });
			if (memberData) {
				if (!isLean) this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return memberData;
			} else { // eslint-disable-next-line new-cap
				memberData = new this.membersData({ id: memberID, guildID: guildID });
				await memberData.save();
				const guild = await this.findOrCreateGuild({ id: guildID });
				if (guild) {
					guild.members.push(memberData._id);
					await guild.save();
				}
				this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
				return isLean ? memberData.toJSON() : memberData;
			}
		}
	}

	/* eslint-disable no-empty-function */ /* eslint-disable consistent-return */
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
			user = this.users.find((users) => users.username === username && users.discriminator === discriminator);
			if (user) return user;
		}
		user = await this.users.fetch(search).catch(() => {});
		return user;
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
		this.database.loadDatabase();
		super.login(token);
	}

};
