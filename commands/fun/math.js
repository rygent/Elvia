const math = require('mathjs'); // npm i mathjs --save
const Discord = require('discord.js');

module.exports = {
    config: {
        name: 'math',
        aliases: ['calc'],
        category: 'fun',
        description: 'Tells you the result of math problem.',
        usage: '<math-problem>',
        accessableby: 'Members'
    },
    run: async (client, message, args, tools) => {
        if (!args[0]) return message.channel.send('Please input a calculation.');
        
        let resp;
        try {
            resp = math.evaluate(args.join(' '));
        } catch (e) {
            return message.channel.send('Sorry, please input a valid calculation.');
        }

        const roleColor = message.guild.me.highestRole.hexColor
        
        const embed = new Discord.RichEmbed()
        .setColor(roleColor === "#000000" ? "#ffffff" : roleColor)
        .setTitle('Math Calculation')
        .addField('Input', `\`\`\`js\n${args.join('')}\`\`\``)
        .addField('Output', `\`\`\`js\n${resp}\`\`\``);
        
        message.channel.send(embed);
    }
};