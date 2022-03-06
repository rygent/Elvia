const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');
const axios = require('axios');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'banner',
			description: 'Display the banner of the provided user.'
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user') || interaction.user;
		const color = await interaction.options.getBoolean('color');

		return interaction.client.users.fetch(user, { force: true }).then(async (result) => {
			const embed = new MessageEmbed()
				.setColor(Colors.Default)
				.setAuthor({ name: result.tag, iconURL: result.displayAvatarURL({ dynamic: true }) })
				.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

			if (!color) {
				if (!result.banner) return interaction.reply({ content: `**${result.tag}**'s has no banner!`, ephemeral: true });

				const button = new MessageActionRow()
					.addComponents(new MessageButton()
						.setStyle(ButtonStyle.Link)
						.setLabel('Open in Browser')
						.setURL(result.bannerURL({ format: 'png', dynamic: true, size: 4096 })));

				embed.setDescription(`***ID:*** \`${result.id}\``);
				embed.setImage(result.bannerURL({ dynamic: true, size: 512 }));

				return interaction.reply({ embeds: [embed], components: [button] });
			}

			if (!result.hexAccentColor) return interaction.reply({ content: `**${result.tag}**'s has no banner color!`, ephemeral: true });

			const headers = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36' };
			const data = await axios.get(`http://www.thecolorapi.com/id?hex=${result.hexAccentColor.replace(/#/g, '')}`, { headers }).then(res => res.data);

			embed.setColor(data.hex.clean);
			embed.setDescription([
				`***ID:*** \`${result.id}\``,
				`***Hex:*** ${data.hex.value}`
			].join('\n'));
			embed.setImage(`https://serux.pro/rendercolour?hex=${data.hex.clean}&height=200&width=512`);

			return interaction.reply({ embeds: [embed] });
		});
	}

};
