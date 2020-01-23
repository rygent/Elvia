const { readdirSync } = require('fs');
const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("Command", "Status");

module.exports = (bot) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of commands) {
            const pull = require(`../commands/${dirs}/${file}`);
            if (pull.config.name) {
                bot.commands.set(pull.config.name, pull);
                table.addRow(file, '✅');
            } else {
                table.addRow(file, `❌  -> missing a help.name, or help.name is not a string.`);
                continue;
            }
            if(pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name));
        }
    };
    ['anime', 'core', 'fun', 'images', 'information', 'lib', 'moderation', 'owner', 'utility'].forEach(x => load(x));

    console.log(table.toString());
}