/* eslint-disable func-names */
module.exports = {
	responseTime: function (message) {
		const time = Date.now() - message.createdTimestamp;
		return `${time || 0} ms`;
	},
	promptMessage: async function (message, author, time, validReactions) {
		time *= 1000;

		for (const reaction of validReactions) await message.react(reaction);

		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

		return message
			.awaitReactions(filter, { max: 1, time: time })
			.then(collected => collected.first() && collected.first().emoji.name);
	}
};
