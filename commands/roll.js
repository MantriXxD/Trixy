module.exports = {
    name: 'roll',
    description: 'Rolls a dice.',
    aliases: ['dice', 'random'],
    cooldown: 5,
    args: true,
    execute(message, args) {

        let dice = args.slice().join(" ");

        if(dice.isNaN === true) {
            return message.channel.send("If you really want an unique dice, you can use negative numbers too, but I am not rolling that thing you sent.");
        }

        else {
            var diceresult = (Math.floor(Math.random() * dice) + 1)
            message.channel.send(`It's ${diceresult}!`);
        }

    },
};