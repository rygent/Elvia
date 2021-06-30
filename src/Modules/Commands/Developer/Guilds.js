const Command = require('../../../Structures/Command.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Colors } = require('../../../Structures/Configuration.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['servers'],
			description: 'Show the servers list.',
			category: 'Developer',
			ownerOnly: true
		});
	}

	/* eslint-disable consistent-return */ /* eslint-disable id-length */ /* eslint-disable max-len */
	async run(message) {
		let i0 = 0;
		let i1 = 10;
		let page = 1;

		let description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(0, 10).join('\n');

		const embed = new MessageEmbed()
			.setColor(Colors.DEFAULT)
			.setAuthor(`Server list of ${this.client.user.username}`, this.client.user.displayAvatarURL({ dynamic: true }))
			.setDescription(description)
			.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`, message.author.displayAvatarURL({ dynamic: true }));

		const row = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('⬅️')
				.setCustomID('previous'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('➡️')
				.setCustomID('next'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setEmoji('❌')
				.setCustomID('delete'));

		return message.reply({ embeds: [embed], components: [row] }).then(msg => {
			const filter = (button) => button.user.id === message.author.id;
			const collector = msg.createMessageComponentInteractionCollector(filter);

			collector.on('collect', async (button) => {
				switch (button.customID) {
					case 'previous':
						i0 -= 10;
						i1 -= 10;
						page -= 1;

						if (i0 < 0) {
							message.delete();
							return msg.delete();
						}

						description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

						embed.setDescription(description);
						embed.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`, message.author.displayAvatarURL({ dynamic: true }));

						return button.update({ embeds: [embed] });
					case 'next':
						i0 += 10;
						i1 += 10;
						page += 1;

						if (i1 > this.client.guilds.cache.size + 10) {
							message.delete();
							return msg.delete();
						}
						if (!i0 || !i1) {
							message.delete();
							return msg.delete();
						}

						description = this.client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((r) => r).map((r, i) => `**${i + 1}.** \`${r.id}\` ${r.name} | ${r.memberCount.formatNumber()} Members`).slice(i0, i1).join('\n');

						embed.setDescription(description);
						embed.setFooter(`Page: ${page}/${Math.ceil(this.client.guilds.cache.size / 10)}`, message.author.displayAvatarURL({ dynamic: true }));

						return button.update({ embeds: [embed] });
					case 'delete':
						message.delete();
						return msg.delete();
				}
			});
		});
	}

};
