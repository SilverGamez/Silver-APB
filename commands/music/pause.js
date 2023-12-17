const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'pause',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.node.pause();

        client.createEmbed(interaction, {
            title: 'Paused the song',
            description: `[${currentTrack.title}](${currentTrack.url})`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("pause")
    .setDescription("Pause the current song")