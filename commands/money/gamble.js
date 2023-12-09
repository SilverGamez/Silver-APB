const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'gamble <amount>',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        const gambledAmount = interaction.options.getNumber("amount").toString().replace(',', '');
        const randomNumber = Math.floor(Math.random() * 5) + 1;

        if (await db.get(`${interaction.user.id}.purse`) < gambledAmount) return client.errorEmbed(interaction, "You can't gamble more than you have in your purse.", 'red');
        db.sub(`${interaction.user.id}.purse`, gambledAmount);

        if (randomNumber == 1 || randomNumber == 2 || randomNumber == 3) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('You lost it all.')
                .setDescription(`You gambled $${client.toNumber(gambledAmount)} and lost it all.`)
                .setColor('Blurple')
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })


            interaction.reply({
                embeds: [embed]
            });
        } else if (randomNumber == 4) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('You won 2x.')
                .setDescription(`You gambled $${client.toNumber(gambledAmount)} and won $${client.toNumber(gambledAmount * 2)}.`)
                .setColor('Blurple')
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })


            interaction.reply({
                embeds: [embed]
            });

            db.add(`${interaction.user.id}.purse`, gambledAmount * 2);
        } else if (randomNumber == 5) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('You won 3x.')
                .setDescription(`You gambled $${client.toNumber(gambledAmount)} and won $${client.toNumber(gambledAmount * 3)}.`)
                .setColor('Blurple')
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })

            interaction.reply({
                embeds: [embed]
            });

            db.add(`${interaction.user.id}.purse`, gambledAmount * 3);
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("gamble")
    .setDescription("Gamble your money to get 2x, 3x or lose it all.")
    .addNumberOption(option => option
        .setName("amount")
        .setDescription("Amount to gamble")
        .setRequired(true))