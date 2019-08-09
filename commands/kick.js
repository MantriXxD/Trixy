module.exports = {
    name: 'kick',
    description: 'Tag a member and kick them.',
    cooldown: 5,
    guildOnly: true,

    execute(message, args) {

        if (message.member.hasPermission("KICK_MEMBERS") === false) {
            message.channel.send("You cannot kick members.");
        }

        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to kick them!');
        }

        const kickauthor = message.member;
        const kickuser = message.mentions.members.first();
        const kickusername = args[0];
        //const kickguild = message.channel.guild;
        //var kickid = kickusername.slice(2, -1);
        //const kickchan = message.kickusername.slice(2, -1);
        let reason = args.slice(1).join(" ");

        //console.log(kickchan);

        if (kickuser === message.author) {
            message.channel.send("You can't kick yourself.");
        }

        if (kickuser.kickable === false) {
            message.channel.send("I cannot kick this user.");
        }

        else {
            //kickchan.send(`You've been kicked from ${kickguild} because: ${reason}`).catch(trashlog => { });
            kickuser.kick();
            message.channel.send(`${kickauthor} succesfully kicked ${kickusername}. Reason: ${reason}`);
        }

    },
};