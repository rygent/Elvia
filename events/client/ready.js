const Discord = require('discord.js')

module.exports = bot => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`)
    bot.user.setStatus('online') // dnd, idle, online, invisible

    let activities = [
        `Cores of pull power.`, `I love my creator`,
        `Enjoying my time with you!`, `Can i get some more of that?`,
        `Don't you all love me? ...Oh well.`, `Doing bot things.`,
        `What about we go out and have some cake?`, `Now with more splashes!`,
        `Wait, do I even have this?`, `I am also a CPU. No, really!`,
        `That's fine, 'cause nothing's gonna scare us now!`, `A little bit of this... a little bit of that... yes, that's it!`,
        `Having fun with ya!`, `Maximum explosion for maximum justice!`,
        `Now singing along you.`, `Damn! I should've finished my backlog before formatting Windows.`
    ], i = 0;

    setInterval(() => bot.user.setActivity(`${bot.prefix}help | ${activities[i++ % activities.length]} | [${bot.users.size}]`, 
    { type: 'PLAYING' }), 600000) //PLAYING, LISTENING, WATCHING, STREAMING
}
