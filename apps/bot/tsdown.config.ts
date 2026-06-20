import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		skipNodeModulesBundle: true
	},
	entry: ['src/**/*', '!src/types/**/*'],
	nodeProtocol: 'strip',
	outExtensions({ format }) {
		return {
			js: '.js',
			dts: format === 'cjs' ? '.d.cts' : '.d.ts'
		};
	},
	platform: 'node',
	target: 'esnext',
	unbundle: true
});
