const fetch = require('node-fetch');

module.exports = {
    config: {
        name: 'djs',
        aliases: ['discord-js'],
        category: 'search',
        description: 'Searches the DJS docs for whatever you\'d like',
        usage: '<query> (branch)',
        example: 'embed setAuthor',
        accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const query = args.join(' ');
        const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;
        
        fetch(url)
        .then(res => res.json())
        .then(embed => {
            if(embed && !embed.error) {
                message.channel.send({ embed });
            } else {
                message.reply(`I don't know mate, but "${query}" doesn't make any sense!`);
            }
        })
        .catch(e => {
            console.error(e);
            message.reply('Darn it! I failed!');
        })
    }
};