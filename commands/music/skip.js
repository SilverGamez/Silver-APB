const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');

module.exports = {
    usage: 'skip',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.skip();

        const currentTrack = queue.currentTrack;

        const embed = new Discord.EmbedBuilder()
            .setTitle('Song skipped')
            .setDescription(`[${currentTrack.title}](${currentTrack.url})`)
            .setColor('Blurple')
            .setThumbnail(currentTrack.thumbnail)
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        interaction.reply({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("skip")
    .setDescription("Skip the current song")