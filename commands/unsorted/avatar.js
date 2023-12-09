const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'avatar [@user>',
    aliases: [],
    category: 'Unsorted',
    run: async (interaction, client, db) => {
        const target = interaction.options.getUser("user") || interaction.user;
        const name = target.globalName || target.username;

        const avatar = target.displayAvatarURL({
            dynamic: true,
            format: 'png'
        });

        const embed = new Discord.EmbedBuilder()
            .setTitle(`${name}'s avatar`)
            .setImage(avatar)
            .setColor('Blurple')
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        interaction.reply({ embeds: [embed] });
    }
}

module.exports.data = new SlashCommand()
    .setName("avatar")
    .setDescription("View your own or someone elses avatar")
    .addUserOption(option => option
        .setName("user")
        .setDescription("Users avatar to view")
        .setRequired(false))