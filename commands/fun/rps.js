const { RichEmbed } = require('discord.js')
const { promptMessage } = require('../../functions.js')

const chooseArr = ['🗻', '📰', '✂']

module.exports = {
    config: {
	name: 'rps',
	aliases: [""],
	category: 'fun',
	description: 'Rock Paper Scissors game. React to one of the emojis to play the game.',
	usage: '[rps]',
	accessableby: 'Members'
    },
    run: async (bot, message, args) => {
        const embed = new RichEmbed()
        .setColor('#ffffff')
        .setFooter(message.guild.me.displayName, bot.user.displayAvatarURL)
        .setDescription('Add a reaction to one of these emojis to play the game!')
        .setTimestamp()

        const m = await message.channel.send(embed)

        const reacted = await promptMessage(m, message.author, 30, chooseArr)


        const botChoice = chooseArr[Math.floor(Math.random() * chooseArr.length)]


        const result = await getResult(reacted, botChoice)

        await m.clearReactions()

        embed
            .setDescription('')
            .addField(result, `${reacted} vs ${botChoice}`)

        m.edit(embed)

        function getResult(me, clientChosen) {
            if ((me === '🗻' && clientChosen === '✂') ||
                (me === '📰' && clientChosen === '🗻') ||
                (me === '✂' && clientChosen === '📰')) {
                    return 'You won!'
            } else if (me === clientChosen) {
                return 'Its a tie!'
            } else {
                return 'You lost!'
            }
        }
    }
}
