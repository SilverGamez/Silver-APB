const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'help [command]',
    aliases: [],
    category: 'Unsorted',
    autocomplete: async (interaction, client, db) => {
        const value = interaction.options.getFocused().toLowerCase();
        let choices = client.commands.map(x => x.data.name);

        const filtered = choices.filter(choice => choice.toLowerCase().includes(value)).slice(0, 25);

        await interaction.respond(filtered.map(choice => ({
            name: choice,
            value: choice
        })));
    },
    run: async (interaction, client, db) => {
        if (interaction.options.getString("command")) {
            const input = interaction.options.getString("command");

            let command = client.commands.get(input) || client.mcommands.get(input);
            if (command == null) return client.errorEmbed(interaction, `Command \`${input}\` doesn't exist. Check the spelling or view all comamnds with \`/help.\``, 'Red');

            let aliases = command.aliases
            if (Array.isArray(aliases) && aliases.length) {
                aliases = command.aliases.join(", ");
            } else {
                aliases = 'There is no aliases for this command'
            }

            let botdevonly = 'false';
            if (command.botdevonly) botdevonly = 'true';

            const embed = new Discord.EmbedBuilder()
                .setTitle(`Help for ${command.data.name}`)
                .addFields({
                    name: 'Name',
                    value: command.data.name
                }, {
                    name: 'Description',
                    value: command.data.description || 'There is no description for this command'
                }, {
                    name: 'Usage',
                    value: command.usage + '\n*Note: <required> [optional]*' || 'There is no usage for this command\n**<required> [optional]**'
                }, {
                    name: 'Aliases',
                    value: aliases
                }, {
                    name: 'Botdev only',
                    value: botdevonly
                })
                .setColor('Blurple')
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })

            interaction.reply({
                embeds: [embed]
            });
        } else {
            let commands = client.commands;

            let prefix = await db.get(`${interaction.guild.id}.prefix`) || client.config.prefix

            let emx = new Discord.EmbedBuilder()
                .setColor("Blurple")
                .setAuthor({
                    name: `Do ${prefix}help <command name> for more information about a command.`
                })
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL()
                })

            let com = {};

            commands.forEach(comm => {
                let category = comm.category || "Unknown";
                let name = comm.data.name;

                if (!com[category]) {
                    com[category] = [];
                }

                com[category].push(name);
            });

            for (const [key, value] of Object.entries(com)) {
                let category = key.charAt(0).toUpperCase() + key.slice(1);
                let desc = value.sort().map((x) => `\`➣ ${x}\`\n`).join('');

                emx.addFields({
                    name: `${category}`,
                    value: desc + "\n"
                });
            }

            interaction.reply({
                embeds: [emx]
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("help")
    .setDescription("View all the commands the bot has to offer")
    .addStringOption(option => option
        .setName("command")
        .setDescription("Get information on a specific command")
        .setRequired(false)
        .setAutocomplete(true))