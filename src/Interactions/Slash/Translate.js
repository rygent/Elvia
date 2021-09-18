const Interaction = require('../../Structures/Interaction.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Color } = require('../../Utils/Setting.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'translate',
			description: 'Translate text to the desired language',
			options: [
				{ type: 3, name: 'from', description: 'Source language', required: true },
				{ type: 3, name: 'to', description: 'Destination language', required: true },
				{ type: 3, name: 'message', description: 'Message to translate (max: 2800)', required: true }
			]
		});
	}

	async run(interaction) {
		const fromLanguage = interaction.options.getString('from', true);
		const toLanguage = interaction.options.getString('to', true);
		const message = interaction.options.getString('message', true);

		if (message.length > 2800) {
			return interaction.reply({ content: 'Unfortunately, the text is too long!\nPlease try again with shorter text.', ephemeral: true });
		}

		try {
			const translated = await translate(message, { from: fromLanguage.trim(), to: toLanguage.trim() });
			const from = translated.from.language.iso;

			const embed = new MessageEmbed()
				.setColor(Color.G_TRANSLATE)
				.setAuthor('Google Translate', 'https://i.imgur.com/1JS81kv.png', 'https://translate.google.com/')
				.setDescription([
					`${translated.text}\n`,
					`Translation from ***${this.client.utils.formatLanguage(from)}*** to ***${this.client.utils.formatLanguage(toLanguage.trim())}***`
				].join('\n'))
				.setFooter(`${interaction.user.username}  •  Powered by Google Translate`, interaction.user.avatarURL({ dynamic: true }));

			return interaction.reply({ embeds: [embed] });
		} catch {
			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setStyle('LINK')
					.setLabel('ISO 639-1')
					.setURL('https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes'));

			return interaction.reply({ content: 'Please send valid **ISO 639-1** languages codes.', components: [button], ephemeral: true });
		}
	}

};
