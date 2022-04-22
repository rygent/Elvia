const { Collection } = require('discord.js');
const UserData = require('../Schemas/UserData');
const GuildData = require('../Schemas/GuildData');
const MemberData = require('../Schemas/MemberData');
const mongoose = require('mongoose');

module.exports = class Database {

	constructor(client) {
		this.client = client;

		this.usersData = new UserData();
		this.guildsData = new GuildData();
		this.membersData = new MemberData();

		this.databaseCache = {};
		this.databaseCache.users = new Collection();
		this.databaseCache.guilds = new Collection();
		this.databaseCache.members = new Collection();
	}

	async loadDatabases() {
		try {
			return mongoose.connect(this.client.mongodb, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		} catch (error) {
			this.client.logger.error(`Unable to connect MongoDB:\n${error.stack}`, { error });
		}
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

};
