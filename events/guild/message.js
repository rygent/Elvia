const { Client } = require('../../utils/settings');

module.exports = async (bot, message) => {
    if(message.author.bot || message.channel.type === 'dm') return;

    let suffix = message.content.substr(message.content.split(' ')[0].length + 1)
    let args = message.content.slice(Client.PREFIX.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(Client.PREFIX)) return;
    let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
    if(commandfile) commandfile.run(bot, message, args, suffix);
}