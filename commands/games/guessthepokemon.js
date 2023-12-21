const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const Games = require('discord-gamecord'); 

module.exports = {
    usage: 'guessthepokemon',
    aliases: [],
    category: 'Games',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const Game = new Games.GuessThePokemon({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Who\'s The Pokemon',
              color: '#5865F2'
            },
            timeoutTime: 60000,
            winMessage: 'You guessed it right! It was a {pokemon}.',
            loseMessage: 'Better luck next time! It was a {pokemon}.',
            errMessage: 'Unable to fetch pokemon data! Please try again.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
    }
}

module.exports.data = new SlashCommand()
    .setName("guessthepokemon")
    .setDescription("Guess the pokemon")