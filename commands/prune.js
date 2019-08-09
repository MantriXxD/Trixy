module.exports = {
    name: 'prune',
    description: 'Prune up to 100 messages.',
    aliases: ['purge', 'bulk', 'delete'],
    cooldown: 5,
    execute(message, args) {

        const amount = parseInt(args[0]);

        if (message.member.hasPermission("MANAGE_MESSAGES") !== true) { message.channel.send("You cannot manage messages.") };

        if (isNaN(amount)) {
            return message.reply('That doesn\'t seem to be a valid number.');
        } else if (amount <= 0 || amount >= 101) {
            return message.reply('You need to input a number between 1 and 100.');
        }



        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error while trying to prune messages in this channel.');
        });

    },
};