const { RichEmbed } = require('discord.js');
const Errors = require('../../utils/errors');
const unirest = require('unirest');

module.exports = {
    config: {
        name: 'country',
        aliases: [''],
        category: 'utility',
        description: 'Gets information about a country.',
        usage: '<countryName>',
        example: 'Indonesia',
        accessableby: 'Members'
    },
    run: async (bot, message, args, suffix) => {
        unirest.get('https://restcountries.eu/rest/v2/name/' + suffix + '?fullText=true')
        .end(result2 => {
            let res = result2.body;
            
            if (!res) return Errors.resBody(message, 'Country', 'country')
            
            else if (res.status === 404) return Errors.resStatus(message, '404')
            
            for (let i = 0; i < res.length; i++) {
                let country = new RichEmbed();
                let capital = res[i].capital || 'N/A';
                let code = res[i].alpha2Code || 'N/A';
                let code2 = res[i].alpha3Code || 'N/A';
                let Ccode = res[i].callingCodes || 'N/A';
                country.setTitle(res[i].name)
                .setAuthor(message.author.tag, message.author.avatarURL)
                .setDescription('Country Information')
                .addField('Capital', capital, true)
                .addField('Domain', code + ', ' + code2, true)
                .addField('Calling Code', '+'+Ccode, true)
                .addField('Region', res[i].region, true)
                .addField('Subregion', res[i].subregion, true)
                .addField('Population', res[i].population, true)
                .addField('Area', res[i].area + ' Square Kilometers', true)
                .addField('Timezones', res[i].timezones.join('\n'), true)
                .addField('Native Name', res[i].nativeName, true)
                .addField('Alternate Names', res[i].altSpellings.join(', '), true)
                .addField('Demonym', res[i].demonym, true)
                .addField('Flag', res[i].flag, true)
                .setFooter('Powered by restcountries.eu')
                .setColor(message.guild.me.displayColor)
                .setTimestamp();
                message.channel.send({ embed: country });
            }
        })
    }
};