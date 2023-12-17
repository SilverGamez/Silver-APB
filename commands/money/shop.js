const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'shop',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const description = Object.entries(client.config.items).map(v => `${v[1].name} ${v[1].emoji} [$${client.toNumber(v[1].price)}]: ${v[1].description}`).join('\n');

        client.createEmbed(interaction, {
            title: 'Shop',
            description: description
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("shop")
    .setDescription("View the shop")