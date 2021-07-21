const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['servers'],
			description: 'Show the servers list.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	/* eslint-disable id-length */
	async run(message) {
		let i0 = 0;
		let i1 = 10;
		let page = 1;

		let description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(0, 10).join('\n');

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setAuthor(`Server list of ${this.client.user.username}`, this.client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(description)
			.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, message.author.displayAvatarURL({ dynamic: true }));

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

		return message.reply({ embeds: [embed], components: [button] }).then((msg) => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentCollector({ filter, time: 300000 });

			collector.on('collect', async (button) => {
				switch (button.customId) {
					case 'previous': {
						i0 -= 10;
						i1 -= 10;
						page -= 1;

						if (i0 < 0) {
							collector.stop();
							return button.update({ components: [] });
						}

						description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

						embed.setDescription(description);
						embed.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, message.author.displayAvatarURL({ dynamic: true }));

						return button.update({ embeds: [embed] });
					}
					case 'next': {
						i0 += 10;
						i1 += 10;
						page += 1;

						if (i1 > this.client.guilds.cache.size + 10) {
							collector.stop();
							return button.update({ components: [] });
						}
						if (!i0 || !i1) {
							collector.stop();
							return button.update({ components: [] });
						}

						description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

						embed.setDescription(description);
						embed.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)} (Times out in 5 minutes)`, message.author.displayAvatarURL({ dynamic: true }));

						return button.update({ embeds: [embed] });
					}
					case 'delete': {
						collector.stop();
						return msg.delete();
					}
				}
			});

			collector.on('end', (collected) => {
				if (collected.size === 0) {
					embed.setFooter(`Timed out`, message.author.displayAvatarURL({ dynamic: true }));
					return msg.edit({ embeds: [embed], components: [] });
				}
			});
		});
	}

};
