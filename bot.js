const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

function checkMembers(guild) {
  let memberCount = 0;
  guild.members.forEach(member => {
    if (!member.user.bot) memberCount++;
  });
  return memberCount;
}

client.on("ready", () => {
  client.user.setActivity("new members!", { type: 'WATCHING' });
});

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'member-log');
  if (!channel) return;
  channel.send(new Discord.RichEmbed()
  .setTitle(`Welcome ${member.user.tag}!`)
  .setDescription(`You're the member #${checkMembers(member.guild)}!`)
  .setColor("BLUE")
)});

client.login(config.token);