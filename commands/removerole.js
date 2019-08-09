module.exports = {
    name: 'removerole',
    description: 'Removes a role from an user',
    cooldown: 3,
    aliases: ['remove'],
    execute(message, args) {

        if (message.member.hasPermission("MANAGE_ROLES") !== true) { message.channel.send("You cannot manage roles.") };

        let removeuser = message.mentions.members.first()
        let removerole = message.guild.roles.find(role => role.name === args[1])

        if (removeuser.roles.some(role => role.name === args[1])) {
            message.channel.send("But you already haven't that role...");
        }

        try {
            removeuser.removeRole(removerole);
            message.channel.send(`Removed **${removerole.name}** from **${removeuser}**`);
        } catch (error) {
            console.error(error);
            message.reply(`I seem to be unable to manage this role or user, or it already hasn't this role.`);
        }

    },
};