const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');
const fs = require('fs');
const chalk = require('chalk').default;

module.exports = async (client, guildId) => {
  const commands = [];

  const clientId = client.user?.id;

  fs.readdirSync('./commands').forEach(dir => {
    const commandFiles = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${dir}/${file}`);
      commands.push(command.data.toJSON());
    }
  })

  const rest = new REST({
    version: '9'
  }).setToken(config.token);

  (async () => {
    try {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId), {
          body: commands
        },
      );
      // console.log(chalk.green(`[Slash Commands]`) + chalk.whiteBright(` loaded in ${client.guilds.cache.get(guildId)}`))
    } catch (error) {
      console.error(error);
    }
  })();
}