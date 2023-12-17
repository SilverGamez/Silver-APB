const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: '8ball <question>',
    aliases: [],
    category: 'Games',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const respones = [
            "As I see it, yes.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don’t count on it.",
            "It is certain.",
            "It is decidedly so.",
            "Most likely.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Outlook good.",
            "Reply hazy, try again.",
            "Signs point to yes.",
            "Very doubtful.",
            "Without a doubt.",
            "Yes.",
            "Yes – definitely.",
            "You may rely on it."
        ];

        const reply = Math.floor(Math.random() * (respones.length - 1) + 1);
        const question = interaction.options.getString("question");

        client.createEmbed(interaction, {
            title: '🎱 8 Ball 🎱',
            description: '**Question:**\n\n' + "```\n" + question + "```\n" + "**Answer:**\n\n" + "```\n" + respones[reply] + "```"
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("8ball")
    .setDescription("Ask 8ball a question")
    .addStringOption(option => option
        .setName("question")
        .setDescription("Question to ask the 8ball")
        .setRequired(true))