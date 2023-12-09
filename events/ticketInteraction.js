const Discord = require('discord.js');
const Permissions = Discord.PermissionsBitField.Flags;
const transcript = require('discord-html-transcripts');

module.exports = {
    name: 'interactionCreate',
    once: false,
    run: async (interaction, client, db) => {
        if (interaction.customId == 'ticketCreateSelect') {
            const modal = new Discord.ModalBuilder()
                .setTitle('Create your ticket')
                .setCustomId('ticketModal')

            const why = new Discord.TextInputBuilder()
                .setCustomId('whyTicket')
                .setRequired(true)
                .setPlaceholder('What is the reason for creating this ticket')
                .setLabel('Why are you creating this ticket?')
                .setStyle(Discord.TextInputStyle.Paragraph)

            const info = new Discord.TextInputBuilder()
                .setCustomId('infoTicket')
                .setRequired(false)
                .setPlaceholder('Feel free to leave this blank')
                .setLabel('Provide any additional information')
                .setStyle(Discord.TextInputStyle.Paragraph)

            const one = new Discord.ActionRowBuilder()
                .addComponents(why)

            const two = new Discord.ActionRowBuilder()
                .addComponents(info)

            modal.addComponents(one, two);
            await interaction.showModal(modal);
        }

        if (interaction.customId == 'ticketModal') {
            const user = interaction.user;
            const data = await db.get(`${interaction.guild.id}.ticketSystem`);

            if (!data) return interaction.reply({
                content: 'Looks like you found this message but the ticket system is not setup here',
                ephemeral: true
            });
            else {
                const why = interaction.fields.getTextInputValue('whyTicket');
                const info = interaction.fields.getTextInputValue('infoTicket');
                const category = await interaction.guild.channels.cache.get(data.Category);

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${user.id}`,
                    type: Discord.ChannelType.GuildText,
                    topic: `Ticket user: ${user.username}; Ticket Reason: ${why}`,
                    parent: category,
                    permissionsOverwrites: [{
                            id: interaction.guild.id,
                            deny: [Permissions.ViewChannel]
                        },
                        {
                            id: user.id,
                            allow: [Permissions.ViewChannel, Permissions.SendMessages, Permissions.ReadMessageHistory]
                        }
                    ]
                });

                const embed = new Discord.EmbedBuilder()
                    .setColor('Blurple')
                    .setTitle(`Ticket from ${user.username} 🎫`)
                    .setDescription(`Opening Reason: ${why}\n\nExtra Information: ${info}`)
                    .setTimestamp()

                const button = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('closeTicket')
                        .setLabel('🔒 Close Ticket')
                        .setStyle(Discord.ButtonStyle.Danger),

                        new Discord.ButtonBuilder()
                        .setCustomId('ticketTranscript')
                        .setLabel('📜 Transcript')
                        .setStyle(Discord.ButtonStyle.Primary)
                    )

                await channel.send({
                    embeds: [embed],
                    components: [button]
                });
                interaction.reply({
                    content: `✨ Your ticket has been opened in ${channel}`,
                    ephemeral: true
                });
            }
        }

        if (interaction.customId == 'closeTicket') {
            const closeModal = new Discord.ModalBuilder()
                .setTitle('Ticket Closing')
                .setCustomId('closeTicketModal')

            const reason = new Discord.TextInputBuilder()
                .setCustomId('closeReasonTicket')
                .setRequired(true)
                .setPlaceholder('What is the reason for closing this ticket?')
                .setLabel('Provide a closing reason')
                .setStyle(Discord.TextInputStyle.Paragraph)

            const one = new Discord.ActionRowBuilder().addComponents(reason)

            closeModal.addComponents(one);
            await interaction.showModal(closeModal);
        }

        if (interaction.customId == 'closeTicketModal') {
            const channel = interaction.channel;
            const userID = channel.name.replace('ticket-', '');
            const member = await interaction.guild.members.cache.get(userID);

            const reason = interaction.fields.getTextInputValue('closeReasonTicket');
            interaction.reply(`🔒 Closing this ticket...`);

            setTimeout(async () => {
                await channel.delete().catch(err => {});
                await member.send(`📢 You are receiving this notifcation because your ticket in ${interaction.guild.name} has been closed for: \`${reason}\``).catch(err => {});
            }, 5000);
        }

        if (interaction.customId == 'ticketTranscript') {
            const file = await transcript.createTranscript(interaction.channel, {
                limit: -1,
                returnBuffer: false,
                filename: `${interaction.channel.name}.html`
            });

            const msg = await interaction.channel.send({
                content: `🌏 Your ticket transcript:`,
                files: [file]
            });
            const message = `📜 **Here is your [ticket transcript](https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}) from ${interaction.guild.name}!**`;

            await msg.delete().catch(err => {});
            interaction.reply({
                content: message,
                ephemeral: true
            });
        }
    }
}