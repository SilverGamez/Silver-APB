const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'createembed',
    aliases: [],
    category: 'Moderation',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        let channel = interaction.channel;

        const options = new Discord.StringSelectMenuBuilder()
            .setCustomId('embedOptions')
            .setPlaceholder('✏️ Select something to modify')
            .addOptions(
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Title')
                .setDescription('Title of the embed')
                .setValue('embedTitle')
                .setEmoji('❗'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Description')
                .setDescription('Description of the embed')
                .setValue('embedDescription')
                .setEmoji('📜'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Timestamp')
                .setDescription('Enable timestamp on the embed')
                .setValue('embedTimestamp')
                .setEmoji('⌚'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Thumbnail')
                .setDescription('Thumbnail of the embed')
                .setValue('embedThumbnail')
                .setEmoji('📷'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Footer')
                .setDescription('Footer of the embed')
                .setValue('embedFooter')
                .setEmoji('🦶'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Author')
                .setDescription('Author of the embed')
                .setValue('embedAuthor')
                .setEmoji('💁'),
                new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Image')
                .setDescription('Image of the embed')
                .setValue('embedImage')
                .setEmoji('🖼️'),
            )


        const finishButton = new Discord.ButtonBuilder()
            .setCustomId('embedFinish')
            .setLabel('Finish')
            .setStyle(Discord.ButtonStyle.Success)

        const cancelButton = new Discord.ButtonBuilder()
            .setCustomId('embedCancel')
            .setLabel('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)

        const channelButton = new Discord.ButtonBuilder()
            .setCustomId('embedChannel')
            .setLabel('Set Channel')
            .setStyle(Discord.ButtonStyle.Primary)


        const optionRow = new Discord.ActionRowBuilder()
            .addComponents(options)

        const buttonRow = new Discord.ActionRowBuilder()
            .addComponents(channelButton, finishButton, cancelButton)


        const embed1 = new Discord.EmbedBuilder()
            .setDescription("_ _")
            .setColor('Blurple')

        const embed2 = new Discord.EmbedBuilder()
            .setTitle('Create an embed')
            .setDescription('Select the options below to create an embed\n\nCurrent channel set: ' + `<#${channel.id}>`)
            .setColor('Blurple')

        const reponse = await interaction.reply({
            embeds: [embed1, embed2],
            components: [optionRow, buttonRow]
        });

        const collector = reponse.createMessageComponentCollector({
            componentType: Discord.ComponentType.StringSelect,
            filter: m => m.user.id == interaction.user.id,
            time: 600000
        }); // 10 minutes

        const collector2 = reponse.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            filter: m => m.user.id == interaction.user.id,
            time: 600000
        }); // 10 minutes

        collector.on('collect', async (i) => {
            const option = i.values[0].slice(5).toLowerCase();

            if (option == 'title') {
                let value;

                i.reply("What do you want to set as the title of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', m => {
                    value = m.content;

                    i.deleteReply();
                    m.delete();

                    embed1.setTitle(value);
                    interaction.editReply({
                        embeds: [embed1, embed2],
                        components: [optionRow, buttonRow]
                    });

                    col.stop();
                });
            }

            if (option == 'description') {
                let value;

                i.reply("What do you want to set as the description of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', m => {
                    value = m.content;

                    i.deleteReply();
                    m.delete();

                    embed1.setDescription(value);
                    interaction.editReply({
                        embeds: [embed1, embed2],
                        components: [optionRow, buttonRow]
                    });

                    col.stop();
                });
            }

            if (option == 'timestamp') {
                i.reply("What do you want to enable timestamp on the embed? (yes/no)");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;

                    if (m.content == "yes") {
                        embed1.setTimestamp();
                        interaction.editReply({
                            embeds: [embed1, embed2],
                            components: [optionRow, buttonRow]
                        });
                    } else if (m.content == "no") {
                        embed1.setTimestamp(null);
                        interaction.editReply({
                            embeds: [embed1, embed2],
                            components: [optionRow, buttonRow]
                        });
                    } else {
                        let follow = await i.channel.send("Please choose from yes or no");
                        col.stop();

                        return setTimeout(() => {
                            follow.delete();

                            i.deleteReply();
                            m.delete();
                        }, 5000);
                    }

                    i.deleteReply();
                    m.delete();

                    col.stop();
                });
            }

            if (option == 'thumbnail') {
                let value;

                i.reply("What do you want to set as the thumbnail of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;

                    if (!value.startsWith('https://')) {
                        let follow = await i.channel.send("Please send a link of the thumbnail image");
                        col.stop();

                        return setTimeout(() => {
                            follow.delete();

                            i.deleteReply();
                            m.delete();
                        }, 5000);
                    } else {

                        i.deleteReply();
                        m.delete();

                        embed1.setThumbnail(value);
                        interaction.editReply({
                            embeds: [embed1, embed2],
                            components: [optionRow, buttonRow]
                        });
                    }

                    col.stop();
                });
            }

            if (option == 'footer') {
                let value;

                i.reply("What do you want to set as the footer text of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;

                    i.deleteReply();
                    m.delete();

                    embed1.setFooter({text: value});
                    interaction.editReply({
                        embeds: [embed1, embed2],
                        components: [optionRow, buttonRow]
                    });


                    col.stop();
                });
            }

            if (option == 'author') {
                let value;

                i.reply("What do you want to set as the author text of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;

                    i.deleteReply();
                    m.delete();

                    embed1.setAuthor({name: value});
                    interaction.editReply({
                        embeds: [embed1, embed2],
                        components: [optionRow, buttonRow]
                    });


                    col.stop();
                });
            }

            if (option == 'image') {
                let value;

                i.reply("What do you want to set as the image of the embed?");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;

                    if (!value.startsWith('https://')) {
                        let follow = await i.channel.send("Please send a link of the image image");
                        col.stop();

                        return setTimeout(() => {
                            follow.delete();

                            i.deleteReply();
                            m.delete();
                        }, 5000);
                    } else {

                        i.deleteReply();
                        m.delete();

                        embed1.setImage(value);
                        interaction.editReply({
                            embeds: [embed1, embed2],
                            components: [optionRow, buttonRow]
                        });
                    }

                    col.stop();
                });
            }
        });

        collector2.on('collect', async (i) => {
            const option = i.customId.slice(5).toLowerCase();

            if (option == "channel") {
                i.reply("Mention the channel you went to send the embed to");

                const filter = m => m.author.id == interaction.user.id;
                const col = interaction.channel.createMessageCollector({
                    filter: filter,
                    time: 120000,
                }); // 2 minutes

                col.on('collect', async m => {
                    value = m.content;
                    if (!value.includes('<') || !value.includes('#') || !value.includes('>')) {
                        let follow = await i.followUp("Please mention a channel like this: <#" + interaction.channel + ">");

                        setTimeout(() => {
                            i.deleteReply(follow);
                            i.deleteReply();
                            m.delete();
                        }, 5000);
                    } else {
                        value = value.replace('<', '').replace('#', '').replace('>', '');

                        channel = interaction.guild.channels.cache.get(value);
                        embed2.setDescription('Select the options below to create an embed\n\nCurrent channel set: ' + `<#${value}>`);

                        interaction.editReply({
                            embeds: [embed1, embed2],
                            components: [optionRow, buttonRow]
                        });

                        i.deleteReply();
                        m.delete();
                    }

                    col.stop();
                });
            }

            if (option == "finish") {
                channel.send({
                    embeds: [embed1]
                });

                collector.stop();
            }

            if (option == "cancel") {
                collector.stop();
            }
        });

        collector.on('end', async (i) => {
            interaction.deleteReply().catch(err => {});

            collector2.stop();
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("createembed")
    .setDescription("Create an embed")
    .setDefaultMemberPermissions(Discord.PermissionsBitField.Flags.Administrator)