import prettierConfig from '../../prettier.config.js';

/** @type {import('prettier').Config} */
const config = {
	...prettierConfig,
	plugins: ['prettier-plugin-prisma']
};

export default config;
