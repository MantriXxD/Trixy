const ownerid = "278983550039097355";

module.exports = {
    name: 'retreat',
    description: 'PRIVATE',
    execute(message) {

        if (message.author.id !== ownerid) {return;}
        else (message.guild.leave());

    },
};