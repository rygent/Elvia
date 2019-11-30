const { readdirSync } = require('fs')

module.exports = (bot) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'))
        for (let file of commands) {
            const pull = require(`../commands/${dirs}/${file}`)
            bot.commands.set(pull.config.name, pull)
            if(pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name))
        }
    }
    ['fun', 'information', 'miscellaneous', 'moderation', 'owner'].forEach(x => load(x))
}