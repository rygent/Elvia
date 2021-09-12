module.exports = class Resolver {

	static async resolveChannel({ message, target, channelType = 'GUILD_TEXT' }) {
		const contentToCheck = target || message.content;
		if (!contentToCheck || typeof contentToCheck !== 'string') return;

		if (contentToCheck.match(/^<#([0-9]{18})>/)) {
			const [, channelId] = contentToCheck.match(/^<#([0-9]{18})>/);
			const channelFound = message.guild.channels.cache.get(channelId);
			if (channelFound && channelType && channelFound.type === channelType) return channelFound;
		}

		if (message.guild.channels.cache.has(target)) {
			const channelFound = message.guild.channels.cache.get(target);
			if (channelFound && channelType && channelFound.type === channelType) return channelFound;
		}

		if (message.guild.channels.cache.some(channel => `#${channel.name}` === target || channel.name === target)) {
			const channelFound = message.guild.channels.cache.find(channel => `#${channel.name}` === target || channel.name === target);
			if (channelFound && channelType && channelFound.type === channelType) return channelFound;
		}
		return;
	}

	static async resolveUser({ message, target, useMessageContent = false, force = false }) {
		const contentToCheck = target || (useMessageContent ? message.content : null);
		if (!contentToCheck || typeof contentToCheck !== 'string') return;

		if (contentToCheck.match(/^<@!?(\d+)>$/)) {
			const [, userId] = contentToCheck.match(/^<@!?(\d+)>$/);
			const userFound = await message.client.users.fetch(userId, { force }).catch(() => {});
			if (userFound) return userFound;
		}

		if (await message.client.users.fetch(target, { force }).catch(() => {})) {
			const userFound = await message.client.users.fetch(target, { force });
			if (userFound) return userFound;
		}

		const [username, discriminator] = contentToCheck.match(/^!?(\w+)#(\d+)$/);
		if (message.client.users.cache.some(user => user.username === username && user.discriminator === discriminator)) {
			const userFound = message.client.users.cache.find(user => user.username === username && user.discriminator === discriminator);
			if (userFound) return userFound;
		}
		return;
	}

	static async resolveMember({ message, target, useMessageContent = false, force = false }) {
		const contentToCheck = target || (useMessageContent ? message.content : null);
		if (!contentToCheck || typeof contentToCheck !== 'string') return;

		if (contentToCheck.match(/^<@!?(\d+)>$/)) {
			const [, userId] = contentToCheck.match(/^<@!?(\d+)>$/);
			const memberFound = await message.guild.members.fetch(userId, { force }).catch(() => {});
			if (memberFound) return memberFound;
		}

		if (await message.guild.members.fetch(target, { force }).catch(() => {})) {
			const memberFound = await message.guild.members.fetch(target, { force });
			if (memberFound) return memberFound;
		}

		await message.guild.members.fetch({ query: target, force });
		if (message.guild.members.cache.some(member => member.user.tag === target || member.user.username === target)) {
			const memberFound = message.guild.members.cache.find(member => member.user.tag === target || member.user.username === target);
			if (memberFound) return memberFound;
		}
		return;
	}

};
