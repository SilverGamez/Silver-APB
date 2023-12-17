const chalk = require('chalk').default;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (client) => {
        console.log(chalk.red("[BOT]") + " Bot is online.");

        client.guilds.cache.forEach(guild => {
            require(`../handlers/loadCommands`)(client, guild.id);
        });
    }
}