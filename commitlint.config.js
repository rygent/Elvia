/** @type {import('@commitlint/types').UserConfig} */
const config = {
	extends: ['@commitlint/config-angular'],
	rules: {
		'type-enum': [
			2,
			'always',
			['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'types']
		],
		'scope-case': [0]
	}
};

export default config;
