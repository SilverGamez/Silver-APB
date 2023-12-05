const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'createembed <channel> [options]',
    aliases: [],
    category: 'Unsorted',
    run: async (interaction, client, db) => {
        const channel = interaction.options.getChannel("channel") || null;
        const title = interaction.options.getString("title") || null;
        const description = interaction.options.getString("description") || null;
        const colour = interaction.options.getString("colour") || "5865F2";
        const timestamp = interaction.options.getBoolean("timestamp") ? Date.now() : null;
        const thumbnail = interaction.options.getString("thumbnail") || null;
        const footer = interaction.options.getString("footer") || null;
        const author_name = interaction.options.getString("author_name") || null;
        const author_icon = interaction.options.getString("author_icon") || null;
        const image = interaction.options.getString("image") || null;
        const title_url = interaction.options.getString("title_url") || null;

        const embed = new Discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(colour)
            .setTimestamp(timestamp)
            .setThumbnail(thumbnail)
            .setFooter(footer)
            .setAuthor({name: author_name, iconURL: author_icon})
            .setImage(image)
            .setURL(title_url)
        
        channel.send({embeds: [embed]});
    }
}

module.exports.data = new SlashCommand()
    .setName("createembed")
    .setDescription("Create an embed")
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("Channel to send the embed in")
        .setRequired(true))
    .addStringOption(option => option
        .setName("title")
        .setDescription("Title of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("description")
        .setDescription("Description of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("colour")
        .setDescription("Colour of embed (https://htmlcolorcodes.com/)")
        .setRequired(false))
    .addBooleanOption(option => option
        .setName("timestamp")
        .setDescription("Enable/Disable timestamp of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("thumbnail")
        .setDescription("Thumbnail of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("footer")
        .setDescription("Footer of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("author_name")
        .setDescription("Author name of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("author_icon")
        .setDescription("Author icon of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("image")
        .setDescription("Image of embed")
        .setRequired(false))
    .addStringOption(option => option
        .setName("title_url")
        .setDescription("Title url of embed")
        .setRequired(false))