const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const moment = require('moment');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'daily',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        let timeout = 86400000; // 24h
        let amount = 10000; // 10k

        let dailyCooldown = await db.get(`${interaction.user.id}.cooldowns.daily`);

        if (dailyCooldown !== null && timeout - (Date.now() - dailyCooldown) > 0) {
            const time = Math.floor(new Date(moment(dailyCooldown).add(timeout, 'ms').toDate()).getTime() / 1000);
            client.errorEmbed(interaction, `You can use this command again <t:${time}:R>`, 'Red');
        } else {
            client.createEmbed(interaction, {
                title: 'Daily reward claimed',
                description: `💵 You have collected your daily reward of $${client.toNumber(amount)}.`
            });

            await db.add(`${interaction.user.id}.purse`, amount);
            await db.set(`${interaction.user.id}.cooldowns.daily`, Date.now());
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("daily")
    .setDescription("Claim your daily reward")