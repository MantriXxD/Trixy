const Discord = require('discord.js');

module.exports = {
    name: 'server',
    description: 'Display info about this server.',
    aliases: ['serverinfo'],
    execute(message) {

        function checkBots(guild) {
            let botCount = 0;
            guild.members.forEach(member => {
                if (member.user.bot) botCount++;
            });
            return botCount;
        }
        function checkMembers(guild) {
            let memberCount = 0;
            guild.members.forEach(member => {
                if (!member.user.bot) memberCount++;
            });
            return memberCount;
        }
        var serverembed = new Discord.RichEmbed()
            .setAuthor(`${message.guild.name}`, message.guild.iconURL)
            .setColor('BLUE')
            .addField('Server owner', message.guild.owner, true)
            .addField('Server region', message.guild.region, true)
            .addField('Verification level', message.guild.verificationLevel)
            .addField('Channel count', message.guild.channels.size, true)
            .addField('Roles count', message.guild.roles.size, true)
            .addField('Total member count', message.guild.memberCount)
            .addField('Humans', checkMembers(message.guild), true)
            .addField('Bots', checkBots(message.guild), true)
            .setThumbnail(message.guild.iconURL)
            .setFooter('Guild created at:')
            .setTimestamp(message.guild.createdAt);
        message.channel.send(serverembed);
        
    },
};