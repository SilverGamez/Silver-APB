const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const useQueue = require('discord-player').useQueue;
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'setvolume <volume>',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const newVolume = interaction.options.getNumber("volume");
        if (newVolume < 0 || newVolume > 200) return client.errorEmbed(interaction, "Please choose a number from 1-200", "Red");

        const queue = useQueue(interaction.guild.id);
        queue.node.setVolume(newVolume);

        client.createEmbed(interaction, {
            title: 'Volume set',
            description: `Set the bots volume to ${newVolume}`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("setvolume")
    .setDescription("setvolume")
    .addNumberOption(option => option
        .setName("volume")
        .setDescription("What to set the new volume to")
        .setRequired(true))