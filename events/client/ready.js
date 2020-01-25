const { Client } = require('../../utils/settings');
const activities = require('../../assets/json/activities');

module.exports = bot => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);

    setInterval(function() {
        let activity = `${Client.PREFIX}help | ${activities[Math.floor(Math.random() * activities.length)]}`;
        bot.user.setActivity(activity, {type: 'PLAYING'}); //PLAYING, LISTENING, WATCHING, STREAMING

    }, 600000);
}
