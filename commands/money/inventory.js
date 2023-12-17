const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'inventory',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const items = client.config.items;

        const ownedItems = await db.get(`${user.id}.items`) || {};
        const itemMap = Object.keys(ownedItems).map(x => items[x].name).join('\n') || "No items in inventory.";

        client.createEmbed(interaction, {
            title: 'Iventory',
            description: `**Items**\n\n\`${itemMap}\``
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("inventory")
    .setDescription("View your inventory")
    .addUserOption(option => option
        .setName("user")
        .setDescription("Users balance to view")
        .setRequired(false))