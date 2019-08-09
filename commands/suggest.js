module.exports = {
    name: 'suggest',
    description: 'Latency calculation.',
    cooldown: 5,
    args: true,
    execute(message, args) {

        let suggestion = args.slice().join(" ");
        console.log(`==================SUGGESTION: """""${suggestion}"""""====================`);
        message.channel.send("Thanks for your suggestion, it will be proccessed as soon as possible! If you leave us your Discord tag in the suggestion, we will contact you and send you the answer you deserve!");

    },
};