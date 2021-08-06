const { MessageEmbed } = require('discord.js');
const { Color } = require('../Utils/Configuration.js');
const chalk = require('chalk');

module.exports = {

	async init(client) {
		client.membersData.find({ 'mute.muted': true }).then((members) => {
			members.forEach((member) => {
				client.databaseCache.mutedUsers.set(`${member.id}${member.guildID}`, member);
			});
		});

		setInterval(async () => {
			client.databaseCache.mutedUsers.filter((member) => member.mute.endDate <= Date.now()).forEach(async (memberData) => {
				const guild = client.guilds.cache.get(memberData.guildID);
				if (!guild) return;
				const member = guild.members.cache.get(memberData.id) || await guild.members.fetch(memberData.id).catch(() => {
					memberData.mute = {
						muted: false,
						endDate: null,
						case: null
					};
					memberData.save();
					process.stdout.write(`[${chalk.blueBright('INFO')}] (unmute) ${memberData.id} cannot be found.`);
					return null;
				});
				const guildData = await client.findOrCreateGuild({ id: guild.id });
				guild.data = guildData;
				if (member) {
					guild.channels.cache.forEach((channel) => {
						const permOverwrites = channel.permissionOverwrites.get(member.id);
						if (permOverwrites) permOverwrites.delete();
					});
				}
				const user = member ? member.user : await client.users.fetch(memberData.id);
				const embed = new MessageEmbed()
					.setColor(Color.DEFAULT)
					.setDescription(`${user.toString()} (\`${user.tag}\`) has just been unmuted! (mute case: #${memberData.mute.case})`)
					.setFooter(`Moderation system powered by ${client.user.username}`, client.user.avatarURL({ dynamic: true }));
				const sendChannel = guild.channels.cache.get(guildData.plugins.moderations);
				if (sendChannel) {
					sendChannel.send({ embeds: [embed] });
				}
				memberData.mute = {
					muted: false,
					endDate: null,
					case: null
				};
				client.databaseCache.mutedUsers.delete(`${memberData.id}${memberData.guildID}`);
				await memberData.save();
			});
		}, 1000);
	}

};
