const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const moment = require('moment');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'fish',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const randomAmount = Math.floor(Math.random() * 5000) + 1;

        const timeout = 300000;
        const cooldown = await db.get(`${interaction.user.id}.cooldowns.fishing`);

        const rod = await db.get(`${interaction.user.id}.items.rod`);
        if (!rod) return client.errorEmbed(interaction, 'You do not own a fishing rod.', 'Red');

        if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
            const time = Math.floor(new Date(moment(cooldown).add(timeout, 'ms').toDate()).getTime() / 1000);
            client.errorEmbed(interaction, `You can use this command again <t:${time}:R>`, 'Red');
        } else {
            client.createEmbed(interaction, {
                description: `${client.config.items.rod.emoji} You went fishing and found $${client.toNumber(randomAmount)}.`
            });

            db.add(`${interaction.user.id}.purse`, randomAmount);
            db.set(`${interaction.user.id}.cooldowns.fishing`, Date.now());
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("fish")
    .setDescription("Fish up money")