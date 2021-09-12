module.exports = class Event {

	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.type = options.once ? 'once' : 'on';
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
	}

	// eslint-disable-next-line no-unused-vars
	async run(...args) {
		throw new Error(`The run method has not been implemented in ${this.name}`);
	}

};
