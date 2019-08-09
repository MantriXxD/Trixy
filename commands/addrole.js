module.exports = {
    name: 'addrole',
    description: 'Adds a role to an user',
    cooldown: 3,
    aliases: ['add'],
    execute(message, args) {

        if (message.member.hasPermission("MANAGE_ROLES") !== true) { message.channel.send("You cannot manage roles.") };

        let adduser = message.mentions.members.first()
        let addrole = message.guild.roles.find(role => role.name === args[1])

        if (adduser.roles.some(role => role.name === args[1])) {
            message.channel.send("But you already have that role...");
        }

        try {
            adduser.addRole(addrole);
            message.channel.send(`Added **${addrole.name}** to **${adduser}**`);
        } catch (error) {
            console.error(error);
            message.reply(`I seem to be unable to manage this role or user.`);
        }

    },
};