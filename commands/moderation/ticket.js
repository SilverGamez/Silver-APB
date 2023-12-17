const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'ticket <send/setup/remove>',
    aliases: [],
    category: 'Moderation',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const subcommand = interaction.options.getSubcommand();
        const data = await db.get(`${interaction.guild.id}.ticketSystem`);

        switch (subcommand) {
            case 'send':
                if (!data) return client.createEmbed(interaction, {
                    content: `⚠️ You have to setup up the ticket system with \`/ticket setup\` before using this command.`,
                    ephemeral: true
                });

                const name = interaction.options.getString("name");
                const message = interaction.options.getString("message") || `Create a ticket to talk with the server staff.`;

                const select = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.StringSelectMenuBuilder()
                        .setCustomId('ticketCreateSelect')
                        .setPlaceholder(`🌏 ${name}`)
                        .addOptions({
                            label: 'Create your ticket',
                            description: 'Click to begin the ticket creation process',
                            value: 'createTicket'
                        })
                    )

                const embed = new Discord.EmbedBuilder()
                    .setTitle('✨ Create a ticket')
                    .setDescription('🎫 ' + message)
                    .setFooter({
                        text: interaction.guild.name,
                        iconURL: interaction.guild.iconURL()
                    })

                interaction.reply({
                    content: `🌏 Adding ticket message below`,
                    ephemeral: true
                });
                interaction.channel.send({
                    embeds: [embed],
                    components: [select]
                });

                break;
            case 'remove':
                if (!data) return client.createEmbed(interaction, {
                    content: `⚠️ You have to setup up the ticket system with \`/ticket setup\` before using this command.`,
                    ephemeral: true
                });
                else {
                    db.delete(`${interaction.guild.id}.ticketSystem`);
                    interaction.reply({
                        content: `🌏 Deleted the ticket category`,
                        ephemeral: true
                    });
                }
                break;
            case 'setup':
                if (data) return client.createEmbed(interaction, {
                    content: `⚠️ You already have a ticket category set up.`,
                    ephemeral: true
                });
                else {
                    const category = interaction.options.getChannel("category");
                    await db.set(`${interaction.guild.id}.ticketSystem`, {
                        Guild: interaction.guild.id,
                        Category: category.id
                    });

                    interaction.reply({
                        content: `🌏 I have set the category to **${category}**. Use \`/ticket send\` to send a ticket create message`,
                        ephemeral: true
                    });
                }
                break;
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("ticket")
    .setDescription("Ticket system")
    .addSubcommand(subcommand => subcommand
        .setName("setup")
        .setDescription("Set up the ticket system")
        .addChannelOption(option => option
            .setName("category")
            .setDescription("Category for tickets to be opened in")
            .addChannelTypes(Discord.ChannelType.GuildCategory)
            .setRequired(true)))
    .addSubcommand(subcommand => subcommand
        .setName("send")
        .setDescription("Send the ticket message")
        .addStringOption(option => option
            .setName("name")
            .setDescription("Name for open ticket menu")
            .setRequired(true))
        .addStringOption(option => option
            .setName("message")
            .setDescription("Message of the embed")
            .setRequired(false)))
    .addSubcommand(subcommand => subcommand
        .setName("remove")
        .setDescription("Disable ticket system"))
    .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.Administrator)