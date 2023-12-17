const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'deposit <amount>',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const purseBalance = await db.get(`${interaction.user.id}.purse`) || 0;
        const amount = interaction.options.getNumber("amount");

        if (amount > purseBalance) return client.errorEmbed(interaction, "You dont have enough money to do that.", "Red");

        await db.sub(`${interaction.user.id}.purse`, amount);
        await db.add(`${interaction.user.id}.bank`, amount);

        client.createEmbed(interaction, {
            title: 'Deposit complete',
            description: `Deposited $${client.toNumber(amount)} to the bank.`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("deposit")
    .setDescription("Deposit monet to your bank")
    .addNumberOption(option => option
        .setName("amount")
        .setDescription("Amount to deposit")
        .setRequired(true))