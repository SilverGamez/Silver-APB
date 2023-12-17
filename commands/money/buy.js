const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'buy',
    aliases: [],
    category: 'Money',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const items = client.config.items;

        const SelectMenu = new Discord.StringSelectMenuBuilder()
            .setCustomId('buy')
            .setPlaceholder('Choose an item to buy')

        Object.entries(items).forEach(x => {
            SelectMenu.addOptions(
                    new Discord.StringSelectMenuOptionBuilder()
                    .setLabel(x[1].name)
                    .setDescription(`${x[1].description} [$${client.toNumber(x[1].price)}]`)
                    .setValue(x[0])
                    .setEmoji(x[1].emoji)
                )
                .setMaxValues(1)
        });

        const ActionRow = new Discord.ActionRowBuilder()
            .addComponents(SelectMenu)

        const message = await interaction.reply({
            components: [ActionRow]
        });

        try {
            const collector = message.createMessageComponentCollector({
                componentType: Discord.ComponentType.StringSelect,
                time: 120_000
            });

            collector.on('collect', async (i) => {
                const itemName = Object.entries(items).map(x => x[0]).find(x => x == i.values[0]);
                const item = items[itemName];

                const BoughtEmbed = client.createEmbed(interaction, {
                    description: `Bought ${item.name} ${item.emoji} for $${client.toNumber(item.price)}`,
                    returnEmbed: true
                });

                const MissingMoney = client.createEmbed(interaction, {
                    description: "You don't have enough money to buy this",
                    returnEmbed: true
                });

                const AlreadyOwned = client.createEmbed(interaction, {
                    description: "You already own this tiem.",
                    returnEmbed: true
                });

                if (item.price > await db.get(`${interaction.user.id}.purse`)) return message.edit({
                    embeds: [MissingMoney],
                    components: []
                });

                if (await db.get(`${interaction.user.id}.items.${i.values[0]}`)) return message.edit({
                    embeds: [AlreadyOwned],
                    components: []
                });

                collector.stop();

                message.edit({
                    embeds: [BoughtEmbed],
                    components: []
                });

                db.sub(`${interaction.user.id}.purse`, item.price);
                db.set(`${interaction.user.id}.items.${i.values[0]}`, true);
            });
        } catch (error) {
            client.throwError(e);
            client.errorEmbed(interaction, `Something went wrong: ${e}`);
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("buy")
    .setDescription("Buy something from the shop")