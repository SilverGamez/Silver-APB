const Discord = require('discord.js');

module.exports = {
    data: {
        name: "createembed",
        description: "Lets a mod create an embed",
        usage: "createembed",
        aliases: [],
        category: "Unsorted",
        botdevonly: false
    },
    run: async (message, args, client, db) => {
        let modperms = message.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)
        let editing = false;

        if (modperms == true) {
            let channel = message.channel;

            let embed1 = new Discord.EmbedBuilder()
                .setDescription("_ _")
                .setColor('Blurple')

            const embed2 = new Discord.EmbedBuilder()
                .setTitle('EMBED EDITOR')
                .setColor('Blurple')
                .setDescription(`Click below buttons to edit embed\n\nCurrent Channel: <#${channel.id}>`)
                .setFooter({
                    text: message.guild.name,
                    iconURL: message.guild.iconURL()
                })

            const comp1 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_title')
                    .setLabel('Title')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_description')
                    .setLabel('Description')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_colour')
                    .setLabel('Colour')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_timestamp')
                    .setLabel('Timestamp')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_thumbnail')
                    .setLabel('Thumbnail')
                    .setStyle('Secondary'),
                )

            const comp2 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_footer')
                    .setLabel('Footer')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_author')
                    .setLabel('Author')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_image')
                    .setLabel('Image')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_url')
                    .setLabel('Title URL')
                    .setStyle('Secondary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_channel')
                    .setLabel('Channel')
                    .setStyle('Secondary')
                )

            const comp3 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_done')
                    .setLabel('Finished')
                    .setStyle('Success'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_edit')
                    .setLabel('Edit embed')
                    .setStyle('Primary'),
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_cancel')
                    .setLabel('Delete')
                    .setStyle('Danger'),
                )

            const comp4 = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('embed_load')
                    .setLabel('Load embed')
                    .setStyle('Secondary'),
                )

            let e = await message.channel.send({
                content: "EXAMPLE EMBED",
                embeds: [embed1, embed2],
                components: [comp1, comp2, comp4, comp3]
            });

            let filterC = (m) => {
                return m.user.id == message.author.id;
            }

            let filter = (m) => m.author.id == message.author.id;

            const collector = message.channel.createMessageComponentCollector({
                filterC
            });

            collector.on('collect', async (m) => {
                if (m.user.id == message.author.id) {
                    let comp = m.customId.replace('embed_', '');

                    if (comp == 'done') {
                        e.delete();
                        channel.send({
                            embeds: [embed1]
                        });
                        db.set(`embeds.${m.message.id}`, embed1);
                        message.channel.send({
                            content: "Embed complete, embed id: " + m.message.id
                        })
                        collector.emit('end');
                    }

                    if (comp == 'cancel') {
                        e.delete();
                        let z = await message.channel.send("Deleting...");
                        setTimeout(() => {
                            z.delete();
                        }, 5000);
                        collector.emit('end');
                    }

                    if (comp == 'load') {
                        let e = await message.channel.send("Please send embed id to load");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            let embd = await db.get(`embeds.${i.content}`);

                            if (embd) {
                                embed1 = new Discord.EmbedBuilder(embd);

                                e.delete()
                                i.delete();

                                let z = await message.channel.send("Embed loaded");

                                setTimeout(() => {
                                    z.delete();
                                }, 1000);

                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            } else return message.channel.send("That embed doesnt exist!");
                        });
                    }

                    if (comp == 'edit') {
                        let p = await message.channel.send("Please send a embed id to edit");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            let v = await message.channel.send("Please mention the channel the embed is in");
                            const cl = message.channel.createMessageCollector({
                                filter: filter,
                                max: 1
                            });

                            cl.on('collect', async (b) => {
                                try {
                                    let messager = await b.mentions.channels.first().messages.fetch(i.content);

                                    await messager.edit({
                                        embeds: [embed1]
                                    });

                                    // await e.delete();
                                    let m = await message.channel.send("Embed updated.");

                                    setTimeout(() => {
                                        m.delete();
                                    }, 5000);

                                    p.delete();
                                    i.delete();
                                    v.delete();
                                    b.delete();
                                } catch (error) {
                                    message.channel.send("An error occured doing that!");
                                    console.log(error)
                                }
                            })
                        });
                    }

                    if (comp == 'title') {
                        let s = await message.channel.send("What do you want as your title?");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            embed1.setTitle(i.content);
                            s.delete();
                            i.delete();

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'description') {
                        let z = await message.channel.send("What do you want as your description?");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            embed1.setDescription(i.content);
                            z.delete();
                            i.delete();

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'colour') {
                        let m = await message.channel.send("What do you want as your description? (HEX CODE https://htmlcolorcodes.com/)");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            embed1.setColor(i.content);
                            m.delete();
                            i.delete();

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'timestamp') {
                        let n = await message.channel.send("Enable timestamp? True/False");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            if (i.content == "true") {
                                embed1.setTimestamp(Date.now());
                            } else if (i.content == "false") {
                                embed1.setTimestamp(false);
                            }

                            n.delete();
                            i.delete();

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'thumbnail') {
                        let b = await message.channel.send("What do you want as your thumbnail (IMAGE URL)");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            b.delete();
                            i.delete();
                            embed1.setThumbnail(i.content);

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'channel') {
                        let m = await message.channel.send("What channel do you want to send the embed? (MENTION CHANNEL)");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            m.delete();
                            i.delete();
                            channel = i.mentions.channels.first() || i.channel;
                            embed2.setDescription(`Click below buttons to edit embed\n\nCurrent Channel: <#${channel.id}>`);

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'footer') {
                        let f = await message.channel.send("What do you want as your Footer Text?");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            let v = await message.channel.send("What do you want as your Footer Picture? Say `null` to set none");
                            const c = message.channel.createMessageCollector({
                                filter: filter,
                                max: 1
                            });

                            c.on('collect', async (a) => {
                                console.log(i.content)
                                console.log(a.content)
                                if (a.content == "null") embed1.setFooter({
                                    text: i.content
                                });
                                if (a.content !== "null") embed1.setFooter({
                                    text: i.content,
                                    iconURL: a.content
                                });
                                v.delete();
                                a.delete();
                                f.delete();
                                i.delete();

                                setTimeout(async () => {
                                    await e.edit({
                                        content: "EXAMPLE EMBED",
                                        embeds: [embed1, embed2],
                                        components: [comp1, comp2, comp4, comp3]
                                    });
                                }, 100);
                            })
                        });
                    }

                    if (comp == 'author') {
                        let l = await message.channel.send("What do you want as your Author Text?");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            let v = await message.channel.send("What do you want as your Author Picture? Say `null` to set none");
                            const c = message.channel.createMessageCollector({
                                filter: filter,
                                max: 1
                            });


                            c.on('collect', async (a) => {
                                if (a.content == "null") embed1.setAuthor({
                                    name: i.content
                                });
                                if (a.content !== "null") embed1.setAuthor({
                                    name: i.content,
                                    iconURL: a.content
                                });
                                v.delete();
                                a.delete();
                                l.delete();
                                i.delete();

                                setTimeout(async () => {
                                    await e.edit({
                                        content: "EXAMPLE EMBED",
                                        embeds: [embed1, embed2],
                                        components: [comp1, comp2, comp4, comp3]
                                    });
                                }, 100);
                            })
                        });
                    }

                    if (comp == 'image') {
                        let v = await interaction.channel.send("What do you want as your image (IMAGE URL)");
                        const c = interaction.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            v.delete();
                            i.delete();
                            embed1.setImage(i.content);

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }

                    if (comp == 'url') {
                        let v = await message.channel.send("What do you want as your title url");
                        const c = message.channel.createMessageCollector({
                            filter: filter,
                            max: 1
                        });

                        c.on('collect', async (i) => {
                            v.delete();
                            i.delete();
                            embed1.setURL(i.content);

                            setTimeout(async () => {
                                await e.edit({
                                    content: "EXAMPLE EMBED",
                                    embeds: [embed1, embed2],
                                    components: [comp1, comp2, comp4, comp3]
                                });
                            }, 100);
                        });
                    }
                }
            });
        } else {
            return message.channel.send("You must be an mod/admin to use this");
        }
    }
}