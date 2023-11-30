const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'inventory',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const items = client.config.items;

        const ownedItems = await db.get(`${user.id}.items`) || {};
        const itemMap = Object.keys(ownedItems).map(x => items[x].name).join('\n') || "No items in inventory.";

        const embed = new Discord.EmbedBuilder()
            .setTitle('Inventory')
            .setDescription(`**Items**\n\n\`${itemMap}\``)
            .setColor('Blurple')

        interaction.reply({
            embeds: [embed]
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