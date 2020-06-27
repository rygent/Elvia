/* eslint-disable func-names */
module.exports = {
	categoryCheck: function (category, message) {
		category = category.toLowerCase();

		switch (category) {
			case 'owner':
				return checkOwner(message.author.id);

			case 'administrator':
				return message.member.permissions.toArray().join(' ').includes('ADMINISTRATOR');

			case 'moderation':
				return message.member.permissions.toArray().join(' ').includes('MANAGE_');

			case 'nsfw':
				return message.channel.nsfw;

			default:
				return true;
		}
		function checkOwner(id) {
			// eslint-disable-next-line no-process-env
			return process.env.OWNER.includes(id);
		}
	}
};
