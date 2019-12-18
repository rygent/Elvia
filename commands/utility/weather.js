const weather = require('weather-js');
const { RichEmbed } = require('discord.js');

module.exports = {
    config: {
        name: 'weather',
        aliases: [''],
        category: 'utility',
        description: 'Shows the weather for a specified location!',
        usage: '<location>',
        accessableby: 'member'
    },
    run: async (bot, message, args) => {
        if (!args[0]) 
            return message.channel.send('Please provide me a city to search up!');
        
        weather.find({
            search: args.join(' '),
            degreeType: 'C'
        }, function (err, result) {
            if (err) 
                message.channel.send(err);
            
            if (result === undefined || result.length === 0) 
                return message.channel.send('**Please verify that it is a valid location!**');
            
            var {
                current,
                location
            } = result[0];

            const embed = new RichEmbed()
            .setAuthor(`Weather for ${current.observationpoint}`)
            .setDescription(`**${current.skytext}**`)
            .setColor(0x00AE86)
            .addField('Timezone', `UTC${location.timezone}`, true)
            .addField('Degree Type', location.degreetype, true)
            .addField('Temperature', `${current.temperature} Degrees`, true)
            .addField('Feels Like', `${current.feelslike} Degrees`, true)
            .addField('Winds', current.winddisplay, true)
            .addField('Humidity', `${current.humidity}%`, true)
            .setThumbnail(current.imageUrl);

            message.channel.send(embed);
        });
    }
}