const InteractionCommand = require('../../../Structures/Interaction');
const { Secrets } = require('../../../Utils/Constants');
const { fetch } = require('undici');

module.exports = class extends InteractionCommand {

	constructor(...args) {
		super(...args, {
			name: ['imgur'],
			description: 'Upload a media to Imgur.'
		});
	}

	async run(interaction) {
		const media = await interaction.options.getAttachment('media', true);
		await interaction.deferReply();

		const stream = await fetch(media.attachment, { method: 'GET' });
		const buffer = Buffer.from(await stream.arrayBuffer()).toString('base64');

		const headers = { Authorization: `Client-ID ${Secrets.ImgurClientId}`, 'Content-Type': 'application/json' };
		const body = await fetch(`https://api.imgur.com/3/upload`, { method: 'POST', body: JSON.stringify({ image: buffer, type: 'base64' }), headers });
		const response = await body.json();

		return interaction.editReply({ content: `Here are your Imgur links:\n<${response.data.link}>` });
	}

};
