const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useQueue = require('discord-player').useQueue;
const Discord = require('discord.js');

module.exports = {
    usage: 'leave',
    aliases: ['stop', 'clearQueue'],
    category: 'Music',
    run: async (interaction, client, db) => {
        const queue = useQueue(interaction.guild.id);
        queue.delete();

        const embed = new Discord.EmbedBuilder()
            .setDescription('I have left the voice channel')
            .setColor('Blurple')
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        
        interaction.reply({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("leave")
    .setDescription("Leaves the voice channel")