const SlashCommand = require('@discordjs/builders').SlashCommandBuilder;
const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const Games = require('discord-gamecord');
const fetch = require('node-fetch'); 

module.exports = {
    usage: 'hangman',
    aliases: [],
    category: 'Games',
    /**
     * @param {Discord.Client} client 
     * @param {Discord.CommandInteraction} interaction 
     * @param {QuickDB} db
     */
    run: async (interaction, client, db) => {
        const reponse = await fetch("https://random-word-api.herokuapp.com/word");
        const word = await reponse.text().toString().slice(2, 2);

        const Game = new Games.Hangman({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Hangman',
              color: '#5865F2'
            },
            hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
            customWord: word,
            timeoutTime: 60000,
            theme: 'nature',
            winMessage: 'You won! The word was **{word}**.',
            loseMessage: 'You lost! The word was **{word}**.',
            playerOnlyMessage: 'Only {player} can use these buttons.'
          });
          
          Game.startGame();
    }
}

module.exports.data = new SlashCommand()
    .setName("hangman")
    .setDescription("Play a game of hangman (guess the word)")