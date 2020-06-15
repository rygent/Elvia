require('dotenv').config();

const RivenClient = require('./structures/RivenClient.js');

const client = new RivenClient();

client.start();
