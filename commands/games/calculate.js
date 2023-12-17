const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const math = require('mathjs');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'calculate',
    aliases: [],
    category: 'Games',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const equation = interaction.options.getString("equation");
        let solution;

        try {
            solution = math.evaluate(equation);

            client.createEmbed(interaction, {
                title: 'Calculator',
                description: "Question" + "```css\n" + equation + "```\n" + "Answer" + "```css\n" + solution + "```"
            });
        } catch (error) {
            return client.createEmbed(interaction, {
                title: 'This is not a __valid__ equation',
                description: 'Please use any of the following:\n\nBrackets: ()\nPower: ^\nDivison: /\nMultiplication: *\nAddition: +\nSubtraction: -'
            });
        }
    }
}

module.exports.data = new SlashCommand()
    .setName("calculate")
    .setDescription("Works like a simple calculator")
    .addStringOption(option => option
        .setName("equation")
        .setDescription("Equation to work out")
        .setRequired(true))