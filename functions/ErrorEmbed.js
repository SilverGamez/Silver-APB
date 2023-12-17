const Discord = require('discord.js');

module.exports = (interaction, content, ephemeral) => {
    if (ephemeral) ephemeral = true;
    
    const embed = new Discord.EmbedBuilder()
        .setTitle('Something went wrong')
        .setColor('Red')
        .setDescription(content)
        .setFooter({  text: interaction.guild.name, iconURL: interaction.guild.iconURL() })

    try {
        if (ephemeral == true) {
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            return interaction.reply({ embeds: [embed] });
        }
    } catch (error) {
        return interaction.channel.send({ embeds: [embed] });
    }
}