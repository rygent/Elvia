/* eslint-disable no-process-env */
require('dotenv').config();

const RivenClient = require('./structures/RivenClient.js');
const config = process.env;

const client = new RivenClient(config);

client.start();
