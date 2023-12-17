const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'balance [@user]',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const name = user.globalName || user.username;

        const purseBalance = await db.get(`${user.id}.purse`) || 0;
        const bankBalance = await db.get(`${user.id}.bank`) || 0;

        client.createEmbed(interaction, {
            title: `${name}'s balance`,
            description: `Purse: \`$${client.toNumber(purseBalance)}\`` + '\n' + `Bank: \`$${client.toNumber(bankBalance)}\``
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("balance")
    .setDescription("View your/others balance")
    .addUserOption(option => option
        .setName("user")
        .setDescription("Users balance to view")
        .setRequired(false))