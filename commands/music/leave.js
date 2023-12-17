const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'leave',
    aliases: ['stop', 'clearQueue'],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.delete();

        client.createEmbed(interaction, {
            description: 'I have left the voice channel'
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("leave")
    .setDescription("Leaves the voice channel")