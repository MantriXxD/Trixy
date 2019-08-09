const Discord = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Tag a member and ban them.',
    cooldown: 5,
    guildOnly: true,

    execute(message, args) {

        if (message.member.hasPermission("BAN_MEMBERS") === false) {
            message.channel.send("You cannot ban members.");
        }

        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to ban them!');
        }

        const banauthor = message.member;
        const banuser = message.mentions.members.first();
        let reason = args.slice(1).join(" ");

        if (banuser === message.author) {
            message.channel.send("You can't ban yourself.");
        }

        if (banuser.banable === false) {
            message.channel.send("I cannot ban this user.");
        }

        else {
            banuser.ban(reason);
            message.channel.send(`${banauthor} succesfully banned ${banuser.username}. Reason: ${reason}`);
        }
    },
};