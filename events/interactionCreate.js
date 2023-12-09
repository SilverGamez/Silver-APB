const chalk = require('chalk').default;

module.exports = {
    name: 'interactionCreate',
    once: false,
    run: async (interaction, client, db) => {
        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction, client, db);
            } catch (error) {
                console.log(error);
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId == 'delete_eval') return interaction.message.delete();
        }

        if (!interaction.isCommand()) return;

        const commandName = interaction.commandName

        const command = client.commands.get(commandName);
        if (!command) return

        if (command.BotDevOnly && interaction.user.id !== client.config.BotConfig.botdev) return;

        try {
            await command.run(interaction, client, db);
        } catch (error) {
            client.throwError(error);
        }
    }
}