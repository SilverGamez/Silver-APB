const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const moment = require('moment');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'hunt',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const randomAmount = Math.floor(Math.random() * 15000) + 1;

        const timeout = 300000;
        const cooldown = await db.get(`${interaction.user.id}.cooldowns.hunt`);

        const shotgun = await db.get(`${interaction.user.id}.items.shotgun`);
        if (!shotgun) return client.errorEmbed(interaction, 'You do not own a shotgun.', 'Red');

        if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
            const time = Math.floor(new Date(moment(cooldown).add(timeout, 'ms').toDate()).getTime() / 1000);
            client.errorEmbed(interaction, `You can use this command again <t:${time}:R>`, 'Red');
        } else {
            client.createEmbed(interaction, {
                description: `${client.config.items.shotgun.emoji} You went hunting and found $${client.toNumber(randomAmount)}`
            });

            db.add(`${interaction.user.id}.purse`, randomAmount);
            db.set(`${interaction.user.id}.cooldowns.hunt`, Date.now());
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("hunt")
    .setDescription("Hunt for money")