const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const useMainPlayer = require('discord-player').useMainPlayer;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'play <query>',
    aliases: [],
    category: 'Music',
     /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
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

            const embed = client.createEmbed(interaction, {
                title: 'Added song to queue',
                description: `[${track.title}](${track.url})`,
                thumbnail: track.thumbnail,
                returnEmbed: true
            });

            return interaction.followUp({
                embeds: [embed]
            });
        } catch (e) {
            client.throwError(e);
            client.errorEmbed(interaction, `Something went wrong: ${e}`);
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