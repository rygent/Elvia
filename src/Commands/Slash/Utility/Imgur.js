const Command = require('../../../Structures/Interaction');
const { Credentials } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: ['imgur'],
			description: 'Upload a media to Imgur.'
		});
	}

	async run(interaction) {
		const media = await interaction.options.getAttachment('media', true);
		await interaction.deferReply({ ephemeral: true });

		const stream = await fetch(media.attachment, { method: 'GET' });
		const buffer = Buffer.from(await stream.arrayBuffer()).toString('base64');

		const body = JSON.stringify({ image: buffer, type: 'base64' });
		const headers = { Authorization: `Client-ID ${Credentials.ImgurClientId}`, 'Content-Type': 'application/json' };

		const raw = await fetch(`https://api.imgur.com/3/upload`, { method: 'POST', body, headers });
		const response = await raw.json();

		return interaction.editReply({ content: `Here are your Imgur links:\n<${response.data.link}>` });
	}

};
