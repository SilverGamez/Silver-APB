const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    name: 'guildCreate',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.Guild} guild
     */
    run: async (guild, client) => {
        const embed = new Discord.EmbedBuilder()
            .setDescription(`I have joined ${guild.name}.\nAccess my commands using \`/\`.\nView all commands with \`/help\``)
            .setColor('Blurple')
            .setFooter({ text: guild.name, iconURL: guild.iconURL() })

        guild.systemChannel.send({ embeds: [embed ]});
        require(`../handlers/loadCommands`)(client, guild.id);
    }
}