const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    name: 'playerStart',
    once: false,
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (queue, track, client, db) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Now playing')
            .setDescription(`[${track.title}](${track.url})`)
            .setThumbnail(track.thumbnail)
            .setColor('Blurple')
            .setFooter({text: queue.metadata.guild.name, iconURL: queue.metadata.guild.iconURL()})

        queue.metadata.channel.send({
            embeds: [embed]
        });
    }
}