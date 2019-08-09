const ownerid = "278983550039097355";

module.exports = {
    name: 'say',
    description: 'PRIVATE',
    args: true,
    execute(message, args) {

        if (message.author.id == ownerid) {
            let say = args.slice().join(" ");
            message.delete().catch(trashlog => { });
            message.channel.send(say);
        } else {
            return;
        }

    },
};