const Discord = require('discord.js');

module.exports = {
    name: 'playerStart',
    once: false,
    run: async (queue, track, client, db) => {
        const embed = new Discord.EmbedBuilder()
            .setTitle('Now playing')
            .setDescription(`[${track.title}](${track.url})`)
            .setThumbnail(track.thumbnail)
            .setColor('Blurple')

        queue.metadata.channel.send({
            embeds: [embed]
        });
    }
}