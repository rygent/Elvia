const Interaction = require('../../../Structures/Interaction.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'Translate Message'
		});
	}

	async run(interaction) {
		const message = interaction.options.getMessage('message', true);
		await interaction.deferReply({ ephemeral: true });

		if (!message.content) return interaction.editReply({ content: 'There is no text in this message.' });

		let locale;
		if (interaction.locale === 'zh-CN' || interaction.locale === 'zh-TW') {
			locale = interaction.locale; // eslint-disable-line prefer-destructuring
		} else {
			locale = new Intl.Locale(interaction.locale).language;
		}

		const translated = await translate(message.content.replace(/(<a?)?:\w+:(\d{18}>)?/g, ''), { to: locale });

		return interaction.editReply({ content: translated.text });
	}

};
