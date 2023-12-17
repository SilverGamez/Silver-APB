const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'resume',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.resume();

        const currentTrack = queue.currentTrack;

        client.createEmbed(interaction, {
            title: 'Resumed the song',
            description: `[${currentTrack.title}](${currentTrack.url})`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("resume")
    .setDescription("Resume the current song")