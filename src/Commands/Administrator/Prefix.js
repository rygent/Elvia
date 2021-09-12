const Command = require('../../Structures/Command.js');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['pfx', 'prefixes', 'guildprefix'],
			description: 'Change prefix on the server.',
			category: 'Administrator',
			usage: '[prefix]',
			memberPerms: ['MANAGE_GUILD'],
			clientPerms: ['MANAGE_GUILD']
		});
	}

	async run(message, [prefix], data) {
		if (!prefix) return message.reply({ content: 'You must define a valid prefix to change it!' });

		const banned = ['#', '@', '`'];
		if (banned.includes(prefix)) return message.reply({ content: 'This prefix is not available, because it contains a markdown character!' });
		if (prefix.length > 5) return message.reply({ content: 'The prefix cannot be longer than 5 characters!' });

		const button = new MessageActionRow()
			.addComponents(new MessageButton()
				.setStyle('PRIMARY')
				.setCustomId('confirm')
				.setLabel('Yep!'))
			.addComponents(new MessageButton()
				.setStyle('SECONDARY')
				.setCustomId('cancel')
				.setLabel('Cancel'));

		const msg = await message.reply({ content: `Are you sure want to change the prefix to \`${prefix}\` ?`, components: [button] });

		const filter = (interaction) => interaction.user.id === message.author.id;
		message.channel.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 1000 * 15 }).then(async (interaction) => {
			switch (interaction.customId) {
				case 'confirm': {
					data.guild.prefix = prefix;
					await data.guild.save();

					return interaction.update({ content: `The prefix has been changed to \`${data.guild.prefix}\`.\nIf you forget the prefix just mention me!`, components: [] });
				}
				case 'cancel': {
					return msg.delete() && message.delete();
				}
			}
		}).catch(() => msg.edit({ content: 'Time\'s up! Please send the command again!', components: [] }));
	}

};
