module.exports = (bot) => {
    let prompt = process.openStdin()
    prompt.addListener('data', res => {
        let x = res.toString().trim().split(/ +/g)
        bot.channels.get('646882466333851672').send(x.join(' '))
    })
}