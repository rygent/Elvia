const config = require('../../.prettierrc.json');

/** @type import('prettier').Config */
module.exports = {
	...config,
	plugins: ['prettier-plugin-prisma']
};
