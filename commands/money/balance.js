const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'balance [@user]',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        const user = interaction.options.getUser("user") || interaction.user;
        const name = user.globalName || user.username;

        const purseBalance = await db.get(`${user.id}.purse`) || 0;
        const bankBalance = await db.get(`${user.id}.bank`) || 0;

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${name}'s balance`)
            .setDescription(`Purse: \`$${purseBalance}\`` + '\n' + `Bank: \`$${bankBalance}\``)
            .setColor('Blurple')

        interaction.reply({
            embeds: [embed]
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