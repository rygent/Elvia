const { RichEmbed } = require('discord.js');
const { stripIndents } = require("common-tags");
const fetch = require('node-fetch');
const moment = require("moment");

module.exports = {
    config: {
        name: 'github',
        aliases: ['git'],
        category: 'lib',
        description: 'Searches github for a user or organisation',
        usage: '<user>',
        example: 'XRzky',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        let username = args.join("-")
        if(!username) return message.channel.send("Please provide a valid github account to search.");
        let url = `https://api.github.com/users/${username}`;
        let user = await fetch(url).then(res => res.json());
        if(user.message) return message.channel.send(`I wasnt able to find \`${username}\` on the github website!`);
  
        let userRepos = await fetch(user.repos_url).then(res => res.json());
        let userFollowers = await fetch(user.followers_url).then(res => res.json());
        let userFollowing = await fetch(url + "/following").then(res => res.json());
  
        let embed = new RichEmbed()
        .setAuthor("GitHub search result", 'https://i.imgur.com/e4HunUm.png', 'https://github.com/')
        .setTitle(user.login)
        .setURL(user.html_url)
        .setThumbnail(user.avatar_url)
        .setDescription(stripIndents`**Name:** ${user.name || "Not Public."}
            **ID:** ${user.id || 'Unknown'}
            **Bio:** ${user.bio || "No Bio."}
            **Location:** ${user.location || "Invisible."}
            **Followers:** ${userFollowers.length}
            **Following:** ${userFollowing.length}
            **Repositories:** ${userRepos.length}
            **Created At: **${moment(user.created_at).format("llll")}`)
          
        message.channel.send(embed);
    }
};