import tseslint from 'typescript-eslint';
import common from 'eslint-config-terrax/common';
import browser from 'eslint-config-terrax/browser';
import node from 'eslint-config-terrax/node';
import typescript from 'eslint-config-terrax/typescript';
import react from 'eslint-config-terrax/react';
import next from 'eslint-config-terrax/next';
import edge from 'eslint-config-terrax/edge';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import merge from 'lodash.merge';

const commonFiles = '{js,jsx,mjs,cjs,ts,tsx}';

const mainRulesets = [...common, ...node, ...typescript].map((config) =>
	merge(config, {
		files: [`**/*${commonFiles}`],
		languageOptions: {
			parserOptions: {
				warnOnUnsupportedTypeScriptVersion: false,
				allowAutomaticSingleRunInference: true,
				project: ['tsconfig.eslint.json', 'apps/*/tsconfig.eslint.json', 'packages/*/tsconfig.eslint.json'],
				tsconfigRootDir: import.meta.dirname
			}
		},
		/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
		rules: {
			'@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					selector: 'typeParameter',
					format: ['PascalCase'],
					custom: {
						regex: '^\\w{3,}',
						match: true
					}
				}
			],
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'no-restricted-globals': 'off'
		},
		settings: {
			'import-x/resolver': {
				typescript: {
					project: ['tsconfig.eslint.json', 'apps/*/tsconfig.eslint.json', 'packages/*/tsconfig.eslint.json']
				}
			}
		}
	})
);

const reactRulesets = [...react, ...edge].map((config) =>
	merge(config, {
		files: [`apps/website/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
		/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
		rules: {
			'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }]
		}
	})
);

const nextRulesets = [...browser, ...next].map((config) =>
	merge(config, {
		files: [`apps/website/**/*${commonFiles}`],
		/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
		rules: {
			'@next/next/no-html-link-for-pages': 'off'
		}
	})
);

export default tseslint.config(
	...mainRulesets,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		ignores: ['**/.contentlayer/', '.git/', '**/.next/', '**/dist/', '**/node_modules/']
	},
	{
		files: [`packages/i18next/**/*${commonFiles}`],
		rules: {
			'@typescript-eslint/consistent-indexed-object-style': 'off',
			'@typescript-eslint/no-unnecessary-type-arguments': 'off',
			'@typescript-eslint/no-redundant-type-constituents': 'off'
		}
	},
	...reactRulesets,
	...nextRulesets,
	{
		files: [`**/*${commonFiles}`],
		rules: {
			'import-x/no-duplicates': ['error', { 'prefer-inline': true }]
		}
	},
	eslintPluginPrettierRecommended
);
