const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useMainPlayer = require('discord-player').useMainPlayer;
const Discord = require('discord.js');

module.exports = {
    usage: 'play <query>',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return client.errorEmbed(interaction, 'You are not connected to a voice channel.', 'Red');
        const query = interaction.options.getString('query', true);

        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction, 
                    volume: 50
                }
            });
            
            const embed = new Discord.EmbedBuilder()
                .setTitle('Added song to queue')
                .setDescription(`[${track.title}](${track.url})`)
                .setThumbnail(track.thumbnail)
                .setColor('Blurple')
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

            return interaction.followUp({ embeds: [ embed] });
        } catch (e) {
            return client.errorEmbed(interaction, `Something went wrong: ${e}`, 'Red');
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("play")
    .setDescription("Plays a song")
    .addStringOption(option => option
        .setName("query")
        .setDescription("Search for song")
        .setRequired(true))