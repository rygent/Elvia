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

	async run(message, [commandName]) {
		if (!commandName) {
			return message.reply({ content: 'Please input the name of the command to reloaded!' });
		}

		const cmd = this.client.commands.get(commandName) || this.client.commands.get(this.client.aliases.get(commandName));

		try {
			delete require.cache[require.resolve(`../${cmd.category}/${cmd.name.toProperCase()}.js`)];
			const File = require(`../${cmd.category}/${cmd.name.toProperCase()}.js`);
			const command = new File(this.client, cmd.name.toLowerCase());
			this.client.commands.delete(cmd.name);
			await this.client.commands.set(cmd.name, command);
			return message.reply({ content: `Successfully reloaded the \`${cmd.name}\` command!` });
		} catch {
			return message.reply({ content: `Can't find \`${commandName}\` command!` });
		}
	}

};
