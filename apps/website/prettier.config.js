import prettierConfig from '../../prettier.config.js';

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	...prettierConfig,
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'^(contentlayer/(.*)$)|^(contentlayer$)',
		'^@/components/(.*)$',
		'^@/hooks/(.*)$',
		'^@/utils/(.*)$',
		'^@/lib/(.*)$',
		'^@/styles/(.*)$',
		'^@/assets/(.*)$',
		'^@/types/(.*)$',
		'^@/(.*)$',
		'<THIRD_PARTY_MODULES>',
		'<BUILTIN_MODULES>',
		'^[./]'
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderTypeScriptVersion: '5.6.3',
	plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss']
};

export default config;
