const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    usage: 'dig',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        const randomAmount = Math.floor(Math.random() * 10000) + 1;

        const timeout = 300000;
        const cooldown = await db.get(`${interaction.user.id}.cooldowns.dig`);

        const shovel = await db.get(`${interaction.user.id}.items.shovel`);
        if (!shovel) return client.errorEmbed(interaction, 'You do not own a shovel.', 'Red');

        if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
            const time = Math.floor(new Date(moment(cooldown).add(timeout, 'ms').toDate()).getTime() / 1000);
            client.errorEmbed(interaction, `You can use this command again <t:${time}:R>`, 'Red');
        } else {
            interaction.reply(`${client.config.items.shovel.emoji} You dug and found $${client.toNumber(randomAmount)}.`);

            db.add(`${interaction.user.id}.purse`, randomAmount);
            db.set(`${interaction.user.id}.cooldowns.dig`, Date.now());
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("dig")
    .setDescription("Dig for money")