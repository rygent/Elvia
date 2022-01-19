const Interaction = require('../../../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../../../Utils/Configuration.js');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			description: 'Display the avatar of the provided user.'
		});
	}

	async run(interaction) {
		const user = await interaction.options.getUser('user') || interaction.user;
		const guild = await interaction.options.getBoolean('guild');

		const button = new MessageButton()
			.setStyle('LINK')
			.setLabel('Open in Browser');

		const embed = new MessageEmbed()
			.setColor(Color.DEFAULT)
			.setFooter({ text: `Powered by ${this.client.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

		if (guild) {
			try {
				const member = await interaction.guild.members.fetch(user);
				if (!member.avatar) return interaction.reply({ content: `**${member.user.tag}**'s has no server avatar!`, ephemeral: true });

				button.setURL(member.avatarURL({ format: 'png', dynamic: true, size: 4096 }));

				embed.setAuthor({ name: member.user.tag, iconURL: member.avatarURL({ dynamic: true }) });
				embed.setDescription(`***ID:*** \`${member.user.id}\``);
				embed.setImage(member.avatarURL({ dynamic: true, size: 512 }));

				return interaction.reply({ embeds: [embed], components: [new MessageActionRow().addComponents([button])] });
			} catch {
				return interaction.reply({ content: 'This user is not on this server!', ephemeral: true });
			}
		}

		button.setURL(user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));

		embed.setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) });
		embed.setDescription(`***ID:*** \`${user.id}\``);
		embed.setImage(user.displayAvatarURL({ dynamic: true, size: 512 }));

		return interaction.reply({ embeds: [embed], components: [new MessageActionRow().addComponents([button])] });
	}

};
