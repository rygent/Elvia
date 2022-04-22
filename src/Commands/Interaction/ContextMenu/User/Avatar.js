const InteractionCommand = require('../../../../Structures/Interaction');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord-api-types/v10');
const { Colors } = require('../../../../Utils/Constants');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['Avatar']
		});
	}

	async run(interaction) {
		const member = await interaction.options.getMember('user');

		const button = new ActionRowBuilder()
			.addComponents([new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Open in Browser')
				.setURL(member.displayAvatarURL({ extension: 'png', size: 4096 }))]);

		const embed = new EmbedBuilder()
			.setColor(Colors.Default)
			.setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
			.setDescription(`***ID:*** \`${member.user.id}\``)
			.setImage(member.displayAvatarURL({ size: 512 }))
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.avatarURL() });

		return interaction.reply({ embeds: [embed], components: [button] });
	}

};
