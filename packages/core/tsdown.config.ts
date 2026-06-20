import { defineConfig } from 'tsdown';

export default defineConfig({
	deps: {
		skipNodeModulesBundle: true
	},
	entry: ['src/index.ts'],
	nodeProtocol: 'strip',
	outExtensions({ format }) {
		return {
			js: '.js',
			dts: format === 'cjs' ? '.d.cts' : '.d.ts'
		};
	},
	platform: 'node',
	sourcemap: true,
	target: 'esnext',
	treeshake: true
});
