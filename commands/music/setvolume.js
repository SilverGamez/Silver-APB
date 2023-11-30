const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const useQueue = require('discord-player').useQueue;

module.exports = {
    usage: 'setvolume <volume>',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const newVolume = interaction.options.getNumber("volume");
        if (newVolume < 0 || newVolume > 200) return client.errorEmbed(interaction, "Please choose a number from 1-200", "Red");

        const queue = useQueue(interaction.guild.id);
        queue.node.setVolume(newVolume);

        const embed = new Discord.EmbedBuilder()
            .setTitle('Volume set')
            .setDescription(`Set the bots volume to ${newVolume}`)
            .setColor('Blurple')

        interaction.reply({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("setvolume")
    .setDescription("setvolume")
    .addNumberOption(option => option
        .setName("volume")
        .setDescription("What to set the new volume to")
        .setRequired(true))