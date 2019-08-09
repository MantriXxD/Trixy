const Discord = require('discord.js');
const { prefix, token } = require('../config.json');
const faces_archive = require("../faces_archive.json");

module.exports = {
    name: 'help',
    description: 'List all of the commands or info about a specific command.',
    aliases: ['commands'],
    cooldown: 5,
    execute(message) {

        var help = new Discord.RichEmbed()
            .addField("I'd love to help!", "Listing all commands:")
            .addField("System:", "Help, invite, suggest, latency.")
            .addField("Moderation:", "Purge, kick, ban.")
            .addField("Entertainment:", "Roll, kitty.")
            .addField("Utility:", "Server, user `WIP`.")
            .addField("Music:", "Play, skip, stop, leave.")
            .setDescription(`My prefix is "${prefix}"`)
            .setThumbnail(faces_archive.pencil)
            .setColor("BLUE")

        return message.author.send(help)
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('It seems like I can\'t DM you!');
            });
    },
};