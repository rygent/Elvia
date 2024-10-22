import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylistic,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.es2024,
				...globals.node
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				project: ['./tsconfig.eslint.json', './apps/*/tsconfig.eslint.json', './packages/*/tsconfig.eslint.json'],
				tsconfigRootDir: import.meta.dirname
			}
		},
		ignores: ['.turbo/', '.vscode/', '.yarn/', 'dist/', 'node_modules/']
	},
	{
		rules: {
			'@typescript-eslint/array-type': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/ban-ts-comment': [
				'error',
				{
					minimumDescriptionLength: 3,
					'ts-check': true,
					'ts-expect-error': false,
					'ts-ignore': 'allow-with-description',
					'ts-nocheck': true
				}
			],
			'@typescript-eslint/ban-ts-ignore': 'off',
			'@typescript-eslint/class-literal-property-style': 'error',
			'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
			'@typescript-eslint/default-param-last': 'error',
			'@typescript-eslint/dot-notation': [
				'error',
				{
					allowKeywords: true,
					allowPattern: '(^[A-Z])|(^[a-z]+(_[a-z]+)+$)',
					allowPrivateClassPropertyAccess: true
				}
			],
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-member-accessibility': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/init-declarations': 'off',
			'@typescript-eslint/interface-name-prefix': 'off',
			'@typescript-eslint/method-signature-style': 'error',
			'@typescript-eslint/no-array-constructor': 'error',
			'@typescript-eslint/no-base-to-string': 'error',
			'@typescript-eslint/no-confusing-non-null-assertion': 'error',
			'@typescript-eslint/no-dupe-class-members': 'error',
			'@typescript-eslint/no-dynamic-delete': 'error',
			'@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
			'@typescript-eslint/no-empty-interface': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-extra-non-null-assertion': 'error',
			'@typescript-eslint/no-extraneous-class': 'error',
			'@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],
			'@typescript-eslint/no-for-in-array': 'error',
			'@typescript-eslint/no-implied-eval': 'error',
			'@typescript-eslint/no-invalid-this': 'error',
			'@typescript-eslint/no-invalid-void-type': 'error',
			'@typescript-eslint/no-misused-new': 'error',
			'@typescript-eslint/no-misused-promises': 'off',
			'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-redeclare': 'error',
			'@typescript-eslint/no-require-imports': 'error',
			'@typescript-eslint/no-shadow': 'warn',
			'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
			'@typescript-eslint/no-unnecessary-qualifier': 'error',
			'@typescript-eslint/no-unnecessary-type-arguments': 'error',
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unused-expressions': 'error',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					args: 'none',
					ignoreRestSiblings: true
				}
			],
			'@typescript-eslint/no-use-before-define': [
				'warn',
				{
					functions: false,
					typedefs: false
				}
			],
			'@typescript-eslint/no-useless-constructor': 'error',
			'@typescript-eslint/non-nullable-type-assertion-style': 'off',
			'@typescript-eslint/only-throw-error': 'error',
			'@typescript-eslint/prefer-as-const': 'error',
			'@typescript-eslint/prefer-for-of': 'error',
			'@typescript-eslint/prefer-function-type': 'error',
			'@typescript-eslint/prefer-includes': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/prefer-readonly': 'error',
			'@typescript-eslint/prefer-readonly-parameter-types': 'off',
			'@typescript-eslint/prefer-reduce-type-parameter': 'error',
			'@typescript-eslint/prefer-regexp-exec': 'error',
			'@typescript-eslint/prefer-return-this-type': 'error',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/require-array-sort-compare': 'error',
			'@typescript-eslint/require-await': 'warn',
			'@typescript-eslint/return-await': 'warn',
			'@typescript-eslint/restrict-plus-operands': 'off',
			'@typescript-eslint/restrict-template-expressions': 'off',
			'@typescript-eslint/switch-exhaustiveness-check': 'warn',
			'@typescript-eslint/triple-slash-reference': 'off',
			'@typescript-eslint/unbound-method': 'error',
			'@typescript-eslint/unified-signatures': 'error'
		}
	},
	{
		plugins: {
			'@stylistic': stylistic
		},
		rules: {
			'@stylistic/array-bracket-newline': ['error', 'consistent'],
			'@stylistic/array-bracket-spacing': [
				'error',
				'never',
				{
					singleValue: false,
					objectsInArrays: false,
					arraysInArrays: false
				}
			],
			'@stylistic/arrow-spacing': ['error', { before: true, after: true }],
			'@stylistic/block-spacing': ['error', 'always'],
			'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'@stylistic/comma-dangle': ['error', 'never'],
			'@stylistic/comma-spacing': ['error', { before: false, after: true }],
			'@stylistic/comma-style': ['error', 'last'],
			'@stylistic/computed-property-spacing': ['error', 'never'],
			'@stylistic/dot-location': ['error', 'property'],
			'@stylistic/eol-last': ['error', 'always'],
			'@stylistic/func-call-spacing': ['error', 'never'],
			'@stylistic/generator-star-spacing': ['error', 'before'],
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],
			'@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true, mode: 'strict' }],
			'@stylistic/keyword-spacing': [
				'error',
				{
					overrides: {
						if: {
							after: true
						},
						for: {
							after: true
						},
						while: {
							after: true
						},
						catch: {
							after: true
						},
						switch: {
							after: true
						}
					}
				}
			],
			'@stylistic/linebreak-style': ['error', 'unix'],
			'@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
			'@stylistic/max-len': [
				'error',
				{
					code: 150,
					tabWidth: 2,
					ignoreStrings: true,
					ignoreTemplateLiterals: true
				}
			],
			'@stylistic/max-statements-per-line': ['error', { max: 2 }],
			'@stylistic/member-delimiter-style': 'error',
			'@stylistic/multiline-ternary': ['error', 'always-multiline'],
			'@stylistic/new-parens': 'error',
			'@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 6 }],
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-floating-decimal': 'error',
			'@stylistic/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
			'@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
			'@stylistic/no-trailing-spaces': 'error',
			'@stylistic/no-whitespace-before-property': 'error',
			'@stylistic/object-curly-newline': ['error', { multiline: true, consistent: true }],
			'@stylistic/object-curly-spacing': ['error', 'always'],
			'@stylistic/operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
			'@stylistic/padded-blocks': ['error', 'never'],
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
			'@stylistic/rest-spread-spacing': ['error', 'never'],
			'@stylistic/semi': ['error', 'always', { omitLastInOneLineBlock: false }],
			'@stylistic/semi-spacing': ['error', { before: false, after: true }],
			'@stylistic/semi-style': ['error', 'last'],
			'@stylistic/space-before-blocks': ['error', 'always'],
			'@stylistic/space-before-function-paren': [
				'error',
				{
					anonymous: 'never',
					named: 'never',
					asyncArrow: 'always'
				}
			],
			'@stylistic/space-in-parens': ['error', 'never'],
			'@stylistic/space-infix-ops': ['error', { int32Hint: true }],
			'@stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
			'@stylistic/spaced-comment': ['error', 'always'],
			'@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
			'@stylistic/template-curly-spacing': ['error', 'never'],
			'@stylistic/template-tag-spacing': ['error', 'never'],
			'@stylistic/type-annotation-spacing': 'error',
			'@stylistic/wrap-iife': ['error', 'inside'],
			'@stylistic/yield-star-spacing': ['error', 'before']
		}
	},
	{
		rules: {
			'accessor-pairs': 'warn',
			'array-callback-return': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			'block-scoped-var': 'error',
			complexity: ['warn', { max: 35 }],
			'consistent-this': ['error', 'self'],
			'constructor-super': 'error',
			curly: ['error', 'multi-line', 'consistent'],
			'default-param-last': 'off',
			'dot-notation': 'off',
			eqeqeq: ['error', 'smart'],
			'func-name-matching': ['warn', 'always'],
			'func-names': ['warn', 'as-needed'],
			'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
			'guard-for-in': 'warn',
			'handle-callback-err': 'error',
			'max-depth': ['error', { max: 5 }],
			'max-nested-callbacks': ['error', { max: 4 }],
			'no-alert': 'error',
			'no-array-constructor': 'off',
			'no-caller': 'error',
			'no-case-declarations': 'error',
			'no-catch-shadow': 'error',
			'no-class-assign': 'warn',
			'no-compare-neg-zero': 'error',
			'no-cond-assign': 'warn',
			'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
			'no-const-assign': 'error',
			'no-debugger': 'error',
			'no-delete-var': 'error',
			'no-dupe-args': 'error',
			'no-dupe-class-members': 'off',
			'no-dupe-keys': 'error',
			'no-duplicate-case': 'error',
			'no-duplicate-imports': 'off',
			'no-else-return': 'warn',
			'no-empty-character-class': 'error',
			'no-empty-function': 'off',
			'no-eq-null': 'warn',
			'no-extend-native': 'warn',
			'no-extra-label': 'warn',
			'no-implicit-coercion': 'error',
			'no-implied-eval': 'off',
			'no-inline-comments': 'warn',
			'no-invalid-regexp': 'warn',
			'no-invalid-this': 'off',
			'no-irregular-whitespace': [
				'error',
				{
					skipStrings: true,
					skipComments: true,
					skipRegExps: true,
					skipTemplates: true
				}
			],
			'no-label-var': 'error',
			'no-lone-blocks': 'error',
			'no-lonely-if': 'error',
			'no-mixed-requires': 'error',
			'no-multi-str': 'error',
			'no-new-func': 'warn',
			'no-new-object': 'error',
			'no-new-require': 'error',
			'no-new-symbol': 'warn',
			'no-new-wrappers': 'warn',
			'no-obj-calls': 'warn',
			'no-octal': 'error',
			'no-octal-escape': 'error',
			'no-path-concat': 'error',
			'no-redeclare': 'off',
			'no-regex-spaces': 'warn',
			'no-return-assign': 'error',
			'no-return-await': 'off',
			'no-self-assign': 'error',
			'no-self-compare': 'warn',
			'no-sequences': 'error',
			'no-shadow': 'off',
			'no-shadow-restricted-names': 'error',
			'no-spaced-func': 'error',
			'no-sparse-arrays': 'warn',
			'no-this-before-super': 'error',
			'no-throw-literal': 'off',
			'no-undef': 'error',
			'no-undef-init': 'error',
			'no-unexpected-multiline': 'error',
			'no-unmodified-loop-condition': 'error',
			'no-unneeded-ternary': ['error', { defaultAssignment: false }],
			'no-unreachable': 'warn',
			'no-unsafe-finally': 'warn',
			'no-unsafe-negation': 'error',
			'no-unused-expressions': 'off',
			'no-unused-labels': 'error',
			'no-unused-vars': 'off',
			'no-useless-call': 'error',
			'no-useless-computed-key': 'error',
			'no-useless-concat': 'warn',
			'no-useless-constructor': 'off',
			'no-useless-escape': 'error',
			'no-useless-rename': 'error',
			'no-useless-return': 'warn',
			'no-var': 'error',
			'no-with': 'error',
			'no-warning-comments': 'warn',
			'one-var': ['error', 'never'],
			'operator-assignment': ['error', 'always'],
			'prefer-arrow-callback': 'error',
			'prefer-const': ['error', { destructuring: 'all' }],
			'prefer-destructuring': [
				'error',
				{
					VariableDeclarator: {
						array: false,
						object: true
					},
					AssignmentExpression: {
						array: true,
						object: false
					}
				},
				{
					enforceForRenamedProperties: false
				}
			],
			'prefer-object-has-own': 'error',
			'prefer-rest-params': 'warn',
			'prefer-spread': 'error',
			'prefer-template': 'warn',
			radix: 'error',
			'require-await': 'off',
			'require-yield': 'warn',
			strict: ['error', 'never'],
			'symbol-description': 'error',
			'unicode-bom': ['error', 'never'],
			'use-isnan': 'error',
			'valid-typeof': 'error',
			yoda: 'error'
		}
	},
	eslintPluginImport.flatConfigs.recommended,
	{
		rules: {
			'import/extensions': ['error', 'ignorePackages'],
			'import/no-duplicates': ['error', { 'prefer-inline': true }],
			'import/no-unresolved': 'off'
		}
	},
	eslintPluginPrettierRecommended
);
