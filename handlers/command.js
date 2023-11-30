const fs = require('fs');
const chalk = require('chalk').default;

module.exports = async (client) => {
    fs.readdirSync('./commands').forEach(dir => {
        const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            client.commands.set(command.data.name, command);
            console.log(chalk.blue(`[Command]`) + chalk.whiteBright(` ${command.data.name} has loaded`));
        }
    });

    const messagecommands = fs.readdirSync(`./mcommands/`).filter(file => file.endsWith('.js'));

    for (const file of messagecommands) {
        const command = require(`../mcommands/${file}`);
        client.mcommands.set(command.data.name, command);
        console.log(chalk.blue(`[Command]`) + chalk.whiteBright(` ${command.data.name} has loaded`));
    }

    console.log(chalk.green("[INFO]") + " Commands have loaded.");
}