const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;

module.exports = {
    usage: 'kick <@user> [reason]',
    aliases: [],
    category: 'Moderation',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const target = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason") || "No reason provided.";

        if(interaction.user.id == target.id) return client.errorEmbed(interaction, "You can't kick yourself.", true);
        if(!target.kickable) return client.errorEmbed(interaction, "I can't kick that member.", true);

        const senderRoles = await interaction.member.roles.cache.map(r => r);
        const targetPerms = target.permissions;

        let higherPerms = new Discord.PermissionsBitField();

        for (let role of senderRoles) {
            if (role.rawPosition > target.roles.highest.rawPosition) {
                higherPerms.add(role.permissions);
            }
        }

        if (interaction.user.id !== interaction.guild.ownerId) {
            if (!higherPerms.has('KickMembers')) return client.errorEmbed(interaction, "Missing permissions, you need to have higher permissions than the user.", true);
            else if (target.has('Administrator') && !higherPerms.has('Administrator')) return client.errorEmbed(interaction, "Missing permissions, you need to have higher permissions than the user.", true);
        }

        await target.kick(reason);
        
        client.createEmbed(interaction, {
            description: `${target} has been kicked for: ${reason}`
        });
    }
}

module.exports.data = new SlashCommand()
    .setName("kick")
    .setDescription("Kick someone from the server")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.KickMembers)
    .addUserOption(option => option
        .setName("user")
        .setDescription("User to kick")
        .setRequired(true))
    .addStringOption(option => option
        .setName("reason")
        .setDescription("Reason to kick the user")
        .setRequired(false))