import { globby } from 'globby';
import fs from 'node:fs';

async function clean() {
	const files = await globby('dist/**/*', { cwd: process.cwd(), absolute: true });

	files.forEach((file) => fs.existsSync(file) && fs.unlinkSync(file));
}

void clean();
