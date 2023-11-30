const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');

module.exports = {
    usage: 'resume',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.resume();

        const currentTrack = queue.currentTrack;

        const embed = new Discord.EmbedBuilder()
            .setTitle('Resumed the song')
            .setColor('Blurple')
            .setDescription(`[${currentTrack.title}](${currentTrack.url})`)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        interaction.reply({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("resume")
    .setDescription("Resume the current song")