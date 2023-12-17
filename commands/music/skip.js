const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'skip',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.skip();

        const currentTrack = queue.currentTrack;

        client.createEmbed(interaction, {
            title: 'Song skipped',
            description: `[${currentTrack.title}](${currentTrack.url})`,
            thumbnail: currentTrack.thumbnail
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("skip")
    .setDescription("Skip the current song")