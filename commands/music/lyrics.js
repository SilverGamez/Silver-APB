const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const lyricsExtractor = require('@discord-player/extractor').lyricsExtractor;
const useQueue = require('discord-player').useQueue;

module.exports = {
    usage: 'lyrics [songname]',
    aliases: [],
    category: 'Music',
    run: async (interaction, client, db) => {
        const lyricsFinder = lyricsExtractor();

        const queue = useQueue(interaction.guild.id);

        let songname;
        if (queue) songname = queue.currentTrack.title;
        if (interaction.options.getString("songname")) songname = interaction.options.getString("songname");
        if (!songname) return client.errorEmbed(interaction, "No song specified.", 'Red');

        const lyrics = await lyricsFinder.search(songname).catch(() => null);
        if (!lyrics) return client.errorEmbed(interaction, `Lyrics for ${songname} were not found.`, 'Red');

        const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

        const embed = new Discord.EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(trimmedLyrics.length == 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setColor('Blurple')

        interaction.reply({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("lyrics")
    .setDescription("View the lyrics of a song")
    .addStringOption(option => option
        .setName("songname")
        .setDescription("Name of song you want to find the lyrics for")
        .setRequired(false))