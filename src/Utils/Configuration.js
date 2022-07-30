export const token = process.env.DISCORD_TOKEN;
export const prefix = process.env.CLIENT_PREFIX;
export const owners = process.env.CLIENT_OWNERS?.split(',').filter(item => item.length);
export const timezone = process.env.TIMEZONE;
export const debug = JSON.parse(process.env.DEBUG_MODE || 'false');
export const defaultPermissions = ['SendMessages', 'ViewChannel'];
