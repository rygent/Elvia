const Discord = require('discord.js');
const request = require('request');
const { Colors, Client } = require('../../utils/settings');
const ytkey = (process.env.YOUTUBEKEY);

module.exports = {
    config: {
        name: 'youtube',
        aliases: ['yt'],
        category: 'utility',
        description: 'Searches for a video on youtube',
        usage: '<input>',
        example: 'Fortnite',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        if (!args[0]) {
            const noinput = `You must include a query. Alternatively, you can check usage via \`${Client.PREFIX}help youtube\``;
            return message.channel.send(noinput);
          }
          const url = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${args}&maxResults=1&type=video&key=${ytkey}`;
          request(url, (err, response, body) => {
            if (err) {
              message.client.logger.error(err);
              return message.channel.send('There is no video by that name.');
            }
            const search = JSON.parse(body);
            try {
              const { title } = search.items[0].snippet;
              const thumbnail = search.items[0].snippet.thumbnails.medium.url;
              const { description } = search.items[0].snippet;
              const newUrl = `https://www.youtube.com/watch?v=${search.items[0].id.videoId}`;
              const embed = new Discord.RichEmbed()
                .setImage(thumbnail)
                .setAuthor(title)
                .setDescription(description)
                .setURL(newUrl)
                .setColor(Colors.RED)
                .setFooter(newUrl);
              return message.channel.send({ embed });
            }
            catch (error) {
              return message.channel.send('I can\'t find a video matching that query!');
            }
          });
    }
};