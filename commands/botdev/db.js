const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

function replace(interaction, text) {
    return text.replace('{user}', interaction.user.id).replace('{server}', interaction.guild.id);
}

module.exports = {
    usage: 'db <set/add/sub/get/all/delete> [options]',
    aliases: [],
    category: 'botdev',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const command = interaction.options.getSubcommand();

        if (command == "set") {
            const key = replace(interaction, interaction.options.getString("key"));
            const value = interaction.options.getString("value");

            db.set(key, value).then(async x => {
                client.createEmbed(interaction, {
                    title: "Output",
                    description: "```\n" + `New value of "${key}" is: ${value}` + "```",
                    ephemeral: true
                });
            });
        }

        if (command == "add") {
            const key = replace(interaction, interaction.options.getString("key"));
            const amount = interaction.options.getNumber("amount");
            const value = await db.get(key);

            const isntnumber = isNaN(value);

            if (isntnumber) return client.errorEmbed(interaction, "Value is not a number.", true);
            if (!isntnumber) {
                db.add(key, amount).then(newValue => {
                    client.createEmbed(interaction, {
                        title: "Output",
                        description: "```\n" + `New value of "${key}" is: "${client.toNumber(value)}"` + "```",
                        ephemeral: true
                    });
                })
            }
        }

        if (command == "sub") {
            const key = replace(interaction, interaction.options.getString("key"));
            const amount = interaction.options.getNumber("amount");
            const value = await db.get(key);

            const isntnumber = isNaN(value);

            if (isntnumber) return client.errorEmbed(interaction, "Value is not a number.", true);
            if (!isntnumber) {
                db.sub(key, amount).then(newValue => {
                    client.createEmbed(interaction, {
                        title: "Output",
                        description: "```\n" + `New value of "${key}" is: "${client.toNumber(value)}"` + "```",
                        ephemeral: true
                    });
                })
            }
        }

        if (command == "get") {
            const key = replace(interaction, interaction.options.getString("key"));
            let value = await db.get(key);

            if (!isNaN(value)) value = client.toNumber(value);

            if (!value) return client.errorEmbed(interaction, "Nothing came up in the db", true);
            else {
                client.createEmbed(interaction, {
                    title: "Output",
                    description: "```json\n" + JSON.stringify(value) + "```",
                    ephemeral: true
                });
            }
        }

        if (command == "all") {
            const values = await db.all();

            client.createEmbed(interaction, {
                title: "Output",
                description: "```json\n" + JSON.stringify(values) + "```",
                ephemeral: true
            });
        }

        if (command == "delete") {
            const key = replace(interaction, interaction.options.getString("key"));

            db.delete(key).then(x => {
                client.createEmbed(interaction, {
                    title: "Output",
                    description: "```\n" + `Delete value of key: "${key}"` + "```",
                    ephemeral: true
                });
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("db")
    .setDescription("Edit the db of the bot")
    // set command
    .addSubcommand(command => command
        .setName("set")
        .setDescription("Set a value in the db")
        .addStringOption(option => option
            .setName("key")
            .setDescription("Key to set value to")
            .setRequired(true))
        .addStringOption(option => option
            .setName("value")
            .setDescription("Value to set")
            .setRequired(true)))
    // add command
    .addSubcommand(command => command
        .setName("add")
        .setDescription("Add to a value")
        .addStringOption(option => option
            .setName("key")
            .setDescription("Key of value to add to")
            .setRequired(true))
        .addNumberOption(option => option
            .setName("amount")
            .setDescription("Amount to add")
            .setRequired(true)))
    // sub command
    .addSubcommand(command => command
        .setName("sub")
        .setDescription("Sub of a value")
        .addStringOption(option => option
            .setName("key")
            .setDescription("Key of value to sub of")
            .setRequired(true))
        .addNumberOption(option => option
            .setName("amount")
            .setDescription("Amount to sub")
            .setRequired(true)))
    // get command
    .addSubcommand(command => command
        .setName("get")
        .setDescription("Get a value from the db")
        .addStringOption(option => option
            .setName("key")
            .setDescription("Key to search for in the db")
            .setRequired(true)))
    // all command
    .addSubcommand(command => command
        .setName("all")
        .setDescription("Get all values from the db"))
    // delete command
    .addSubcommand(command => command
        .setName("delete")
        .setDescription("Delete an item from the db")
        .addStringOption(option => option
            .setName("key")
            .setDescription("Key to of value to delete")
            .setRequired(true)))