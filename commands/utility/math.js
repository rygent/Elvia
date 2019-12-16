const math = require('mathjs');
const Discord = require('discord.js');

module.exports = {
    config: {
        name: 'math',
        aliases: ['solve', 'calc'],
        category: 'utility',
        description: 'I\'ll do your math homework!',
        usage: '<equation>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (!args[0]) return message.channel.send('You have to specify what you would like to count on!');
        
        const mathEquation = args.join(' ');
        let answer;
        try {
            answer = math.evaluate(mathEquation);
        } catch (e) {
            return message.channel.send('Invalid mathematical calculation!');
        }

        const roleColor = message.guild.me.highestRole.hexColor;
        
        const embed = new Discord.RichEmbed()
        .setColor(roleColor === '#000000' ? '#ffffff' : roleColor)
        .setTitle('Math Calculation')
        .addField('Calculation', `\`\`\`js\n${mathEquation}\`\`\``)
        .addField('Result', `\`\`\`js\n${answer}\`\`\``);
        
        message.channel.send(embed);
    }
};