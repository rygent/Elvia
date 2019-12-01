const { RichEmbed } = require('discord.js')

module.exports = {
    config: {
        name: '8ball',
        aliases: ["8b"],
        category: 'fun',
        description: 'Retrieves an answer from the almighty 8ball.',
        usage: '<question>',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (!args[1]) return message.reply('Plase ask a full question!');
        let replies = [
            `It is certain.`,
            `It is decidedly so.`,
            `Without a doubt.`,
            'Yes - definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Dont count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'Maybe',
            'That is sure as hell.',
            'Fire.',
            'Indeed.',
            'Try to be usefull.',
            'Watch the birds.',
            'Gold.',
            'Answer is uncertain.',
            'You are the master of your life',
            'Maybe no.',
            'We can not be never sure.',
            'As you wish.',
            'Eat less, move more.',
            'Better ask yourself.',
            'Just do it.',
            'Sorry, but this is really stupid question.',
            'Try to be usefull.',
            'Water.',
            'We can not be never sure.',
            'You already know the Answer.',
            'Very bad idea.',
            'Never.',
            'Maybe yes.',
            'Maybe no.',
            'NO',
            'YES'
        ];
        
        let result = Math.floor(Math.random() * replies.length);
        let question = args.slice(0).join(' ');
        
        let ballembed = new RichEmbed()
        .setAuthor(message.author.tag)
        .setColor('#03f4fc')
        .addField('Question', question)
        .addField('Answer', replies[result]);
        
        message.channel.send(ballembed);
    }
}