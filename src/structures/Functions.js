module.exports = class Functions {

	static removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	static getMember(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target = message.guild.members.cache.get(toFind);
		if (!target && message.mentions.members) {
			target = message.mentions.members.first();
		}
		if (!target && toFind) {
			target = message.guild.members.cache.find(member => member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind));
		}
		if (!target) {
			target = message.member;
		}
		return target;
	}

	static responseTime(message) {
		const time = Date.now() - message.createdTimestamp;
		return `${time.formatNumber() || 0}ms`;
	}

	static async promptMessage(message, author, time, validReactions) {
		time *= 1000;

		for (const reaction of validReactions) await message.react(reaction);

		const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

		return message
			.awaitReactions(filter, { max: 1, time: time })
			.then(collected => collected.first() && collected.first().emoji.name);
	}

};
