const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['servers'],
			description: 'Show the servers list.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	async run(message) {
		let i0 = 0;
		let i1 = 10;
		let page = 1;

		let description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((v) => v).map((v, i) => `**${i + 1}.** \`${v.id}\` ${v.name} | ${v.memberCount.formatNumber()} Members`).slice(0, 10).join('\n');

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Server list of ${this.client.user.username}`, this.client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(description)
			.setFooter(`${message.author.username}  •  Powered by ${this.client.user.username}`, message.author.avatarURL({ dynamic: true }));

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('⬅️')
				.setCustomId('previous'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('➡️')
				.setCustomId('next'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('❌')
				.setCustomId('delete'));

		const m = await message.reply({ content: `${page} of ${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, embeds: [embed], components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 5 });

		collector.on('collect', async (interaction) => {
			switch (interaction.customId) {
				case 'previous': {
					i0 -= 10;
					i1 -= 10;
					page -= 1;

					if (i0 < 0) {
						collector.stop();
						return interaction.update({ components: [] });
					}

					description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((v) => v).map((v, i) => `**${i + 1}.** \`${v.id}\` ${v.name} | ${v.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

					embed.setDescription(description);

					return interaction.update({ content: `${page} of ${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, embeds: [embed] });
				}
				case 'next': {
					i0 += 10;
					i1 += 10;
					page += 1;

					if (i1 > this.client.guilds.cache.size + 10) {
						collector.stop();
						return interaction.update({ components: [] });
					}
					if (!i0 || !i1) {
						collector.stop();
						return interaction.update({ components: [] });
					}

					description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((v) => v).map((v, i) => `**${i + 1}.** \`${v.id}\` ${v.name} | ${v.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

					embed.setDescription(description);

					return interaction.update({ content: `${page} of ${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, embeds: [embed] });
				}
				case 'delete': {
					collector.stop();
					return m.delete();
				}
			}
		});

		collector.on('end', () => m.edit({ content: 'Timed out', components: [] }));
	}

};
