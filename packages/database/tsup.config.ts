import { createTsupConfig } from '../../tsup.config.js';

export default createTsupConfig({ external: ['../generated/prisma/client.js'] });
