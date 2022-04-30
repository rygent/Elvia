exports.token = process.env.DISCORD_TOKEN;
exports.prefix = process.env.CLIENT_PREFIX;
exports.owners = process.env.CLIENT_OWNERS?.split(',').filter(item => item.length);
exports.mongodb = process.env.MONGODB_URI;
exports.timezone = process.env.TIMEZONE;
exports.debug = JSON.parse(process.env.DEBUG_MODE || 'false');
exports.defaultPermissions = ['SendMessages', 'ViewChannel'];
