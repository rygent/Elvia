const { RichEmbed } = require('discord.js');
const faces = require('../../assets/json/faces');

module.exports = {
    config: {
        name: 'faces',
        aliases: ['facemoji'],
        category: 'fun',
        description: 'Gives a random faces.',
        usage: '',
        example: '',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (message.deletable) {
            message.delete()
        };
        
        message.channel.send(faces[Math.floor(Math.random() * faces.length)])
    }
}