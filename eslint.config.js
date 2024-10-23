import tseslint from 'typescript-eslint';
import common from 'eslint-config-terrax/common';
import node from 'eslint-config-terrax/node';
import typescript from 'eslint-config-terrax/typescript';
import stylistic from 'eslint-config-terrax/stylistic-typescript';
import react from 'eslint-config-terrax/react';
import next from 'eslint-config-terrax/next';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import merge from 'lodash.merge';

const commonFiles = '{js,jsx,mjs,cjs,ts,tsx}';

const commonRuleset = merge(...common, {
	files: [`**/*${commonFiles}`]
});

const nodeRuleset = merge(...node, {
	files: [`**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
	rules: {
		'no-restricted-globals': 'off'
	}
});

const typescriptRuleset = merge(...typescript, {
	files: [`**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.LanguageOptions} */
	languageOptions: {
		parserOptions: {
			warnOnUnsupportedTypeScriptVersion: false,
			allowAutomaticSingleRunInference: true,
			project: ['./tsconfig.eslint.json', './apps/*/tsconfig.eslint.json', './packages/*/tsconfig.eslint.json'],
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
		]
	}
});

const stylisticRuleset = merge(...stylistic, {
	files: [`**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
	rules: {
		'@typescript-eslint/non-nullable-type-assertion-style': 'off'
	}
});

const reactRuleset = merge(...react, {
	files: [`./apps/website/**/*${commonFiles}`, `./packages/ui/**/*${commonFiles}`],
	/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.Rules} */
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }]
	}
});

const nextRuleset = merge(...next, { files: [`./apps/website/**/*${commonFiles}`] });

export default tseslint.config(
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		ignores: ['.next/', '.turbo/', '.vscode/', '.yarn/', 'dist/', 'node_modules/']
	},
	commonRuleset,
	nodeRuleset,
	typescriptRuleset,
	stylisticRuleset,
	reactRuleset,
	nextRuleset,
	eslintPluginImport.flatConfigs.recommended,
	{
		rules: {
			'import/no-duplicates': ['error', { 'prefer-inline': true }],
			'import/no-unresolved': 'off'
		}
	},
	eslintPluginPrettierRecommended
);
