const Interaction = require('../../../../Structures/Interaction');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v9');
const { Colors } = require('../../../../Utils/Constants');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			description: 'Display the avatar of the provided user.'
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user') || interaction.user;

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 })));

		const embed = new MessageEmbed()
			.setColor(Colors.Default)
			.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
			.setDescription(`***ID:*** \`${user.id}\``)
			.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL({ dynamic: true }) });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
