import tseslint from 'typescript-eslint';
import common from 'eslint-config-terrax/common';
import node from 'eslint-config-terrax/node';
import typescript from 'eslint-config-terrax/typescript';
import react from 'eslint-config-terrax/react';
import next from 'eslint-config-terrax/next';
import prettier from 'eslint-config-terrax/prettier';
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

const reactRuleset = merge(...react, {
	files: [`apps/web/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
	rules: {
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }]
	}
});

const nextRuleset = merge(...next, {
	files: [`apps/web/**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
	rules: {
		'@next/next/no-html-link-for-pages': 'off'
	}
});

const prettierRuleset = merge(...prettier, {
	files: [`**/*${commonFiles}`]
});

export default tseslint.config(
	...mainRulesets,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		ignores: ['**/.source/', '.git/', '**/.next/', '**/dist/', '**/node_modules/']
	},
	reactRuleset,
	nextRuleset,
	{
		files: [`**/*${commonFiles}`],
		rules: {
			'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
			'n/prefer-global/buffer': ['error', 'always'],
			'n/prefer-global/process': ['error', 'always'],
			'n/prefer-global/url': ['error', 'always'],
			'n/prefer-global/url-search-params': ['error', 'always']
		}
	},
	prettierRuleset
);
