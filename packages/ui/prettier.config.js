import prettierConfig from '../../prettier.config.js';

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	...prettierConfig,
	tailwindStylesheet: './src/styles/globals.css',
	plugins: ['prettier-plugin-tailwindcss']
};

export default config;
