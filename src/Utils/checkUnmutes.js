const { MessageEmbed } = require('discord.js');
const { Color } = require('./Setting.js');

module.exports = class checkUnmutes {

	constructor(client) {
		this.client = client;
	}

	async init() {
		this.client.membersData.find({ 'mute.muted': true }).then(members => {
			members.forEach(member => {
				this.client.databaseCache.mutedUsers.set(`${member.id}${member.guildId}`, member);
			});
		});

		setInterval(async () => {
			[...this.client.databaseCache.mutedUsers.values()].filter(member => member.mute.endDate <= Date.now()).forEach(async memberData => {
				const guild = this.client.guilds.cache.get(memberData.guildId);
				if (!guild) return;
				const member = guild.members.cache.get(memberData.id) || await guild.members.fetch(memberData.id).catch(async () => {
					memberData.mute = {
						muted: false,
						endDate: null,
						case: null
					};
					await memberData.save();
					this.client.logger.log({ content: `(Unmute) ${memberData.id} cannot be found!` });
					return null;
				});
				const guildData = await this.client.findOrCreateGuild({ id: guild.id });
				guild.data = guildData;
				if (member) {
					guild.channels.cache.forEach(channel => {
						const permOverwrites = channel.permissionOverwrites.get(member.id);
						if (permOverwrites) permOverwrites.delete();
					});
				}
				const user = member ? member.user : await this.client.users.fetch(memberData.id);
				const embed = new MessageEmbed()
					.setColor(Color.DEFAULT)
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))
					.setDescription([
						`***Member:*** ${user.tag} (\`${user.id}\`)`,
						`***Action:*** Unmute`
					].join('\n'))
					.setFooter(`Case #${memberData.mute.case}  •  Powered by ${this.client.user.username}`, this.client.user.avatarURL({ dynamic: true }));

				const channel = guild.channels.cache.get(guildData.plugins.moderations);
				if (channel) {
					return channel.send({ embeds: [embed] });
				}

				memberData.mute = {
					muted: false,
					endDate: null,
					case: null
				};

				this.client.databaseCache.mutedUsers.delete(`${memberData.id}${memberData.guildID}`);
				await memberData.save();
			});
		}, 1000);
	}

};
