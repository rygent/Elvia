module.exports = class Functions {

	static removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	static formatPerms(perm) {
		return perm
			.toLowerCase()
			// eslint-disable-next-line id-length
			.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Activity');
	}

	static formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
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

};
