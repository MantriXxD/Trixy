const snekfetch = require("snekfetch");
const Discord = require("discord.js");

module.exports = {
    name: 'cat',
    description: 'Meow.',
    aliases: ['kitty'],
    cooldown: 5,
    execute(message) {

        snekfetch.get('https://aws.random.cat/meow').then(res => {
            const embed = new Discord.RichEmbed()
                .setImage(res.body.file)
                .setTitle("Here you go! :cat:")
                .setColor("BLUE")
                .setFooter("https://aws.random.cat/meow")
            return message.channel.send(embed);
        });

    },
};