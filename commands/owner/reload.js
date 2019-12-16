const { readdirSync } = require('fs');
const { join } = require('path');
const { Access } = require('../../settings');

module.exports = {
    config: {
        name: 'reload',
        aliases: ['creload'],
        category: 'owner',
        description: 'Reloads a bot command!',
        usage: '<name>',
        accessableby: 'Owner'
    },
    run: async (bot, message, args) => {
        if(message.author.id !== Access.OWNERS) return message.channel.send(`You're not the bot the owner!`);
        if(!args[0]) return message.channel.send('Please provide a command to reload!');
        
        const commandName = args[0].toLowerCase();
        if(!bot.commands.get(commandName)) return message.channel.send(`That command doesn't exist. Try again.`);
        
        readdirSync(join(__dirname, '..')).forEach(f => {
            let files = readdirSync(join(__dirname,'..',f));
            if(files.includes(commandName + '.js')) {
                try {
                    delete require.cache[require.resolve(`../${f}/${commandName}.js`)]; // usage !reload <name>
                    bot.commands.delete(commandName);
                    const pull = require(`../${f}/${commandName}.js`);
                    bot.commands.set(commandName, pull);
                    return message.channel.send(`Successfully reloaded \`${commandName}.js\`!`);
                } catch(e) {
                    return message.channel.send(`Could not reload: \`${args[0].toUpperCase()}\``);
                };
            }
        });
    }
}