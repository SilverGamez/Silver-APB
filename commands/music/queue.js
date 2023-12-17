const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'queue',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        const tracks = queue.tracks.toArray();

        const currentPlaying = queue.currentTrack
        const tracksMap = `\`1.\` **__[${currentPlaying.title}](${currentPlaying.url})__**\n` + tracks.map(x => `\`${tracks.indexOf(x) + 2}.\` [${x.title}](${x.url})\n`).join("")

        client.createEmbed(interaction, {
            title: 'Queue',
            description: tracksMap
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("queue")
    .setDescription("View the current queue")