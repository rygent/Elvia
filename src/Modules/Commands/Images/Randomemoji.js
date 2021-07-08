const Command = require('../../../Structures/Command.js');
const { MessageEmbed } = require('discord.js');
const Emoji = require("demojijs");



module.exports = class extends Command {

        constructor(...args) {
            super(...args, {
                aliases: ['emote'],
                description: 'Sends a random emoji from Emoji.gg database',
                category: 'Emoji.gg',
            });
        }

        async run(message, args, bot) {
            Emoji.randomEmoji().then(Emotes =>{ 
                
                
                
                const embed = new MessageEmbed() 
                .setColor("FF9AA2") // you can set it random color
                .setTitle(` Random Emoji`) 
                .setImage(`${Emotes.image}`) // from .get to insert image as body
                .setDescription(`${Emotes.description}`)
                .setFooter(`This emoji currently has ${Emotes.faves} favourites`);
                return message.reply({ embeds: [embed] });
    
      })
    }
}
