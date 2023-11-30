const Discord = require('discord.js');

module.exports = (interaction, content, colour) => {
    const embed = new Discord.EmbedBuilder()
        .setTitle('Something went wrong')
        .setColor(colour)
        .setDescription(content)
        .setFooter({  text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

    return interaction.reply({ embeds: [embed] });
}