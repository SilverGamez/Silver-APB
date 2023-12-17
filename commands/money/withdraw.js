const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'withdraw <amount>',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const bankBalance = await db.get(`${interaction.user.id}.bank`) || 0;
        const amount = interaction.options.getNumber("amount");

        if (amount > bankBalance) return client.errorEmbed(interaction, "You dont have enough money to do that.", "Red");

        await db.sub(`${interaction.user.id}.bank`, amount);
        await db.add(`${interaction.user.id}.purse`, amount);

        client.createEmbed(interaction, {
            title: 'Withdraw complete',
            description: `Withdrew $${client.toNumber(amount)} from the bank.`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("withdraw")
    .setDescription("Withdraw money from the bank")
    .addNumberOption(option => option
        .setName("amount")
        .setDescription("Amount to withdraw")
        .setRequired(true))