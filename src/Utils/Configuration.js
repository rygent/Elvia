module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.CLIENT_PREFIX,
	owners: process.env.CLIENT_OWNERS?.split(',').filter(item => item.length),
	defaultPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
	mongoURI: process.env.MONGO_URI
};
