const Discord = require('discord.js');

module.exports = {
    name: 'user',
    description: 'Display info about yourself.',
    aliases: ['userinfo'],
    execute(message) {
        var userembed = new Discord.RichEmbed()
            .setAuthor(message.author.tag)
            .setColor("BLUE")
            .setThumbnail(message.author.avatarURL)
            .addField("User ID:", message.author.id)
            .addField("Account birth:", message.author.createdAt)
            .addField(`Joined at:`, message.author.join)
            .addField(`Roles:`, message.author.roles);
        message.channel.send(userembed);
    },
};