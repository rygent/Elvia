const Command = require('../../Structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [],
			description: 'Reload specific commands',
			category: 'Developer',
			usage: '[commandName]',
			ownerOnly: true
		});
	}

	async run(message, [cmd]) {
		if (!cmd) {
			return message.reply({ content: 'Please input the name of the command to reloaded!' });
		}

		const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));

		try {
			delete require.cache[require.resolve(`../${command.category}/${command.name.toProperCase()}.js`)];
			const File = require(`../${command.category}/${command.name.toProperCase()}.js`);
			const Commands = new File(this.client, command.name.toLowerCase());
			this.client.commands.delete(command.name);
			await this.client.commands.set(command.name, Commands);
			return message.reply({ content: `Successfully reloaded the \`${command.name}\` command!` });
		} catch {
			return message.reply({ content: `Can't find \`${cmd}\` command!` });
		}
	}

};
