const { letterTrans } = require('custom-translate');
const dictionary = require('../../assets/json/textflip');

module.exports = {
    config: {
        name: 'textflip',
        aliases: [],
        category: 'fun',
        description: 'Makes the bot flip your text upside down.',
        usage: '<message>',
        example: 'Do you love me?',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (!args[1]) return message.reply('Plase ask a full question!');
        
        const text = args.join(' ');
        const converted = letterTrans(text, dictionary);

        message.channel.send(converted);
    }
}