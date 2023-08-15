import { defineConfig, type Options } from 'tsup';

export function createTsupConfig({
	format = ['esm', 'cjs'],
	target = 'es2022',
	sourcemap = true,
	splitting = true,
	bundle = true,
	dts = true,
	esbuildOptions = (options, context) => {
		if (context.format === 'cjs') {
			options.banner = {
				js: '"use strict";'
			};
		}
	}
}: ConfigOptions = {}) {
	return defineConfig({
		bundle,
		clean: true,
		dts,
		entry: ['src/index.ts'],
		esbuildOptions,
		format,
		keepNames: true,
		minify: false,
		platform: 'node',
		skipNodeModulesBundle: true,
		sourcemap,
		splitting,
		target,
		treeshake: true
	});
}

type ConfigOptions = Pick<
	Options,
	'format' | 'target' | 'sourcemap' | 'splitting' | 'bundle' | 'dts' | 'esbuildOptions'
>;
