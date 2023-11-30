const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'shop',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        const description = Object.entries(client.config.items).map(v => `${v[1].name} ${v[1].emoji} [$${client.toNumber(v[1].price)}]: ${v[1].description}`).join('\n');

        const embed = new Discord.EmbedBuilder()
            .setTitle('Shop')
            .setDescription(description)
            .setColor('Blurple')

        interaction.reply({
            embeds: [embed]
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("shop")
    .setDescription("View the shop")