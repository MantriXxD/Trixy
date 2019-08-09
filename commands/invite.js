const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Deploys an invite for the bot.',
    cooldown: 5,
    execute(message) {

        var invite = new Discord.RichEmbed()
            .setTitle("Refer to MantriX#1572. I am a private bot currnely")
        message.channel.send(invite);

    },
};