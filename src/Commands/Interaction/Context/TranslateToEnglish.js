const Interaction = require('../../../Structures/Interaction.js');
const translate = require('@iamtraction/google-translate');

module.exports = class extends Interaction {

	constructor(...args) {
		super(...args, {
			name: 'Translate to English'
		});
	}

	async run(interaction) {
		const message = interaction.options.getMessage('message', true);
		await interaction.deferReply({ ephemeral: true });

		const translated = await translate(message, { to: 'en' });

		return await interaction.editReply({ content: [
			`${translated.text}\n`,
			`__*Translated from **${this.client.utils.formatLanguage(translated.from.language.iso)}***__`
		].join('\n') });
	}

};
