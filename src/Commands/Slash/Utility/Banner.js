const InteractionCommand = require('../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Util } = require('discord.js');
const { Colors } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['banner'],
			description: 'Display the banner of the provided user.'
		});
	}

	async run(interaction) {
		const user = await this.client.users.fetch(interaction.options.getUser('user') || interaction.user, { force: true });
		const color = await interaction.options.getBoolean('color');

		const embed = new EmbedBuilder()
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		if (color) {
			if (!user.hexAccentColor) return interaction.reply({ content: `**${user.tag}**'s has no banner color!`, ephemeral: true });

			const body = await fetch(`http://www.thecolorapi.com/id?hex=${user.hexAccentColor.replace(/#/g, '')}`, { method: 'GET' });
			const response = await body.json();

			embed.setColor(Util.resolveColor(response.hex.clean));
			embed.setDescription([
				`***ID:*** \`${user.id}\``,
				`***Hex:*** ${response.hex.value}`
			].join('\n'));
			embed.setImage(`https://serux.pro/rendercolour?hex=${response.hex.clean}&height=200&width=512`);

			return interaction.reply({ embeds: [embed] });
		}

		if (!user.banner) return interaction.reply({ content: `**${user.tag}**'s has no banner!`, ephemeral: true });

		const button = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.bannerURL({ extension: 'png', size: 4096 }))]);

		embed.setColor(Colors.Default);
		embed.setDescription(`***ID:*** \`${user.id}\``);
		embed.setImage(user.bannerURL({ size: 512 }));

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
