import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({ external: ['../prisma/client/index.js'] });
