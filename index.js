const Discord = require('discord.js');
const QuickDB = require('quick.db').QuickDB;
const { Player } = require('discord-player');

const config = require('./config.json');
const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((intent) => {
        return Discord.GatewayIntentBits[intent]
    })
});

client.commands = new Discord.Collection();
client.mcommands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.config = config;
client.db = new QuickDB();

client.toNumber = require('./functions/ToNumber');
client.errorEmbed = require('./functions/ErrorEmbed');
client.createEmbed = require('./functions/CreateEmbed');
client.throwError = require('./functions/ThrowError');

const player = new Player(client);
player.extractors.loadDefault(ext => ext == 'YouTubeExtractor');

["command", "event"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.login(config.token);

module.exports.db = client.db;