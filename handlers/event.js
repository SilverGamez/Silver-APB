const fs = require('fs');
const path = require('path');
const chalk = require('chalk').default;
const player = require('discord-player').useMainPlayer();

module.exports = (client) => {
    const eventsFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventsFiles) {
        const filePath = path.join('../events', file);
        const event = require(filePath);
        const eventName = file.replace('.js', '');

        console.log(chalk.yellow("[EVENT]") + ` ${eventName} has loaded.`);

        if (file.includes('player')) {
            player.events.on(event.name, (...args) => event.run(...args, client, client.db));
        } else if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client, client.db));
        } else {
            client.on(event.name, (...args) => event.run(...args, client, client.db));
        }
    }

    console.log(chalk.green("[INFO]") + " Events have loaded.");
}