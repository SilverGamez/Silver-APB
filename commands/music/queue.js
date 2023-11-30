const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');

module.exports = {
    usage: 'queue',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        const tracks = queue.tracks.toArray();

        const currentPlaying = queue.currentTrack
        const tracksMap = `\`1.\` **__[${currentPlaying.title}](${currentPlaying.url})__**\n` + tracks.map(x => `\`${tracks.indexOf(x) + 2}.\` [${x.title}](${x.url})\n`).join("")

        const embed = new Discord.EmbedBuilder()
            .setTitle('Queue')
            .setDescription(tracksMap)
            .setColor('Blurple')
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

        interaction.reply({
            embeds: [embed]
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("queue")
    .setDescription("View the current queue")