const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');

module.exports = {
    usage: 'beg',
    aliases: [],
    category: 'Money',
    run: async (interaction, client, db) => {
        let Money = Math.floor(Math.random() * 2500) + 1;
        let randomMoney = client.toNumber(Money);
        let randomMoney2 = client.toNumber(Money * 2);
        let randomMoney4 = client.toNumber(Money * 4);

        const replies = [
            `No money for you!`,
            `Aww, Take $${randomMoney}.`,
            `Fine little begger, take $${randomMoney} and get a life.`,
            `Go beg to someone else.`,
            `I'm going broke these days, I only have $${randomMoney2}. You can have half of it.`,
            `Take $${randomMoney} and buzz off.`,
            `Shoo little pest, take $${randomMoney} with you.`,
            `Look at my purse, it has $${randomMoney}. Want it? Take it.`,
            `Just get a damm job! Oh, I forgot that you have no money! Just take $${randomMoney} and get a job.`,
            `Never gonna give you money.`,
            `🤑 Money, Money, Money! Oh no, i dropped $${randomMoney}.`,
            `Never not gonna give you money, take $${randomMoney}.`,
            `You begged on the streets and got $${randomMoney2}. To bad you lost half of it.`,
            `I only give money to my friends.`,
            `Poor begger! Take $${randomMoney}.`,
            `*Bang*, *Bang*. Take this non existing money.`,
            `Fineee you dumb begger. I'll give you $${randomMoney}`,
            `You found $${randomMoney4} in the old lady's purse. She wacked you and you ran off with a quater of the money.`,
            `You begged for 24 hours and made $${randomMoney}. You shomehow duplicated the money. I wonder how?`
        ];

        const people = [
            'John',
            'Rick',
            'Billy',
            'Eddy',
            'Noah',
            'Jude',
            'Jarvis',
            'Lachlan',
            'Nathan',
            'Sam',
            'Chris',
            'Jerome',
            'Will',
            'Bob',
            'Noah'
        ];

        if (await db.get(`${interaction.user.id}.cooldowns.beg`)) return client.errorEmbed(interaction, "You can only use this command every 5 seconds.", 'Red');

        const randomReply = replies[Math.floor(Math.random() * replies.length) + 0];
        const randomPerson = people[Math.floor(Math.random() * people.length) + 0];

        const embed = new Discord.EmbedBuilder()
            .setAuthor({
                name: randomPerson
            })
            .setDescription(randomReply)
            .setColor('Blurple')

        interaction.reply({
            embeds: [embed]
        });

        if (randomReply == 'No money for you!') return;
        if (randomReply == 'Go beg to someone else.') return;
        if (randomReply == 'Never gonna give you coins.') return;
        if (randomReply == 'I only give money to my friends.') return;
        if (randomReply == '*Bang*, *Bang*. Take this non existing money.') return;
        if (randomReply == `You begged for 24 hours and made $${randomMoney}. You shomehow duplicated the money. I wonder how?`) return Money = Money * 2;

        await db.add(`${interaction.user.id}.purse`, Money);
        await db.set(`${interaction.user.id}.cooldowns.beg`, true);

        setTimeout(async () => {
            await db.set(`${interaction.user.id}.cooldowns.beg`, false);
        }, 5000);
    }
}

module.exports.data = new SlashCommand()
    .setName("beg")
    .setDescription("Beg for money")