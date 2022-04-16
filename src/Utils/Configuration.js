module.exports = {
	token: process.env.DISCORD_TOKEN,
	prefix: process.env.CLIENT_PREFIX,
	owners: process.env.CLIENT_OWNERS?.split(',').filter(item => item.length),
	timezone: process.env.TIMEZONE,
	defaultPermissions: ['SendMessages', 'ViewChannel'],
	mongoURI: process.env.MONGO_URI
};
