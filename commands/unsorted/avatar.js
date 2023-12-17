const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'avatar [@user>',
    aliases: [],
    category: 'Unsorted',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const target = interaction.options.getUser("user") || interaction.user;
        const name = target.globalName || target.username;

        const avatar = target.displayAvatarURL({
            dynamic: true,
            format: 'png'
        });

        client.createEmbed(interaction, {
            title: `${name}'s avatar`,
            image: avatar
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("avatar")
    .setDescription("View your own or someone elses avatar")
    .addUserOption(option => option
        .setName("user")
        .setDescription("Users avatar to view")
        .setRequired(false))