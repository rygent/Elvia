import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({
	bundle: false,
	dts: false,
	entry: ['src/**/*', '!src/types/**/*'],
	sourcemap: false,
	// @ts-expect-error
	swc: { swcrc: true }
});
