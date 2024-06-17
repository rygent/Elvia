import { relative, resolve as resolveDir } from 'node:path';
import { defineConfig, type Options } from 'tsup';

export function createTsupConfig(options: EnhancedTsupOptions = {}) {
	return defineConfig({
		bundle: options.bundle ?? true,
		clean: true,
		dts: options.dts ?? true,
		entry: options.entry ?? ['src/index.ts'],
		format: options.format ?? ['esm', 'cjs'],
		keepNames: true,
		minify: false,
		platform: 'node',
		skipNodeModulesBundle: true,
		sourcemap: options.sourcemap ?? true,
		splitting: options.splitting ?? true,
		target: options.target ?? 'es2022',
		treeshake: true,
		tsconfig: relative(__dirname, resolveDir(process.cwd(), 'tsconfig.json'))
	});
}

type EnhancedTsupOptions = Pick<Options, 'bundle' | 'dts' | 'entry' | 'format' | 'sourcemap' | 'splitting' | 'target'>;
