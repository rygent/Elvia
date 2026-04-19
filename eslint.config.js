import { defineConfig } from 'eslint/config';
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
		rules: {
			'@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'no-useless-assignment': 'off',
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

const nextRuleset = merge(...react, ...next, {
	files: [`apps/web/**/*${commonFiles}`, `packages/ui/**/*${commonFiles}`],
	rules: {
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
		'react-hooks/set-state-in-effect': 'off'
	}
});

const prettierRuleset = merge(...prettier, {
	files: [`**/*${commonFiles}`]
});

export default defineConfig(
	...mainRulesets,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		ignores: ['**/.source/', '.git/', '**/.next/', '**/dist/', '**/node_modules/']
	},
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
