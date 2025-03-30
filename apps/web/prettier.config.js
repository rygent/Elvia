import prettierConfig from '../../prettier.config.js';

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	...prettierConfig,
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
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
		'^(?!.*[.]css$)[./].*$',
		'.css$'
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	importOrderTypeScriptVersion: '5.8.2',
	plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss']
};

export default config;
