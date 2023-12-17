const Discord = require('discord.js');

module.exports = (interaction, args) => {
    this.interaction = interaction;

    this.returnEmbed = args.returnEmbed || false;
    this.ephemeral = args.ephemeral || false;

    this.description = args.description || null;
    this.content = args.content || null;
    this.title = args.title || null;
    this.titleUrl = args.titleUrl || null;
    this.authorName = args.authorName || null;
    this.authorIcon = args.authorIcon || null;
    this.authorUrl = args.authorUrl || null;
    this.thumbnail = args.thumbnail || null;
    this.image = args.image || null;

    if (!this.interaction) throw new Error("[CREATE_EMBED_FAILED]: Missing interaction argument.");

    const embed = new Discord.EmbedBuilder()
        .setTitle(this.title)
        .setDescription(this.description)
        .setColor('Blurple')
        .setURL(this.titleUrl)
        .setThumbnail(this.thumbnail)
        .setFooter({
            text: this.interaction.guild.name,
            iconURL: this.interaction.guild.iconURL()
        })
        .setAuthor({
            name: this.authorName,
            iconURL: this.authorIcon
        })
        .setImage(this.image)

    if (this.returnEmbed == true) {
        return embed;
    } else if (this.ephemeral == true) {
        return this.interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
        return this.interaction.reply({ content: this.content, embeds: [embed] });
    }
}