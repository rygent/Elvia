module.exports = {
	apps: [
		{
			name: '@aviana/bot',
			cwd: './apps/bot',
			script: './dist/index.js',
			interpreter: 'node',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
