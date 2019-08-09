const fs = require('fs');
const Discord = require('discord.js');
const trixybot = new Discord.Client();
const { prefix, token, ownerid } = require('./config.json');
const faces_archive = require("./faces_archive.json");
const userid_ignore = require("./userid_ignore.json");
const ytdl = require("ytdl-core");
const opus = require("opusscript");
const winston = require("winston")

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'log' }),
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

const express = require('express');
const app = express();
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


var afk = 0;

const queue = new Map();

trixybot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    trixybot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

trixybot.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = trixybot.commands.get(commandName)
        || trixybot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (message.channel.type !== "dm") {
        if (message.guild.me.hasPermission("ADMINISTRATOR") === false) {
            message.channel.send("I must have administrator permission to operate.");
            return;
        }
    }

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }



    if (message.author.id !== ownerid) {
        if (message.content.includes("gay")) { return }
        else if (message.content.includes("cunt")) { return }
        else if (message.content.includes("idiot")) { return }
        else if (message.content.includes("retard")) { return }
        else if (message.content.includes("dumbass")) { return }
        else if (message.content.includes("asshole")) { return }
        else if (message.content.includes("fuck")) { return }
        else if (message.content.includes("fucking")) { return }
        else if (message.content.includes("dick")) { return }
        else if (message.content.includes("nigga")) { return }
        else if (message.content.includes("d1ck")) { return }
        else if (message.content.includes("lgtb")) { return }
        else if (message.content.includes("scum")) { return }
    }
    if (message.author.id === userid_ignore.ignore) return;

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, ownerid, prefix, faces_archive, userid_ignore);
    } catch (error) {
        console.error(error);
        message.reply(`Send to MantriX#1572. An error ocurreed during command execution: ${error}`);
    }
});

//CORE 2//=============================================

trixybot.on('message', async message => {

    if (afk === 1) {
        if (message.content.includes(ownerid)) {
            message.channel.send("He is in AFK mode right now, sorry.");
        }
    }

    if (message.channel.type === "dm") return;

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.author.id === userid_ignore.ignore) return;

    const serverQueue = queue.get(message.guild.id);

    if (command === "play") {
        execute(message, serverQueue);
        return;
    }
    if (command === "skip") {
        skip(message, serverQueue);
        return;
    }
    if (command === "stop") {
        stop(message, serverQueue);
        return;
    }
    if (command === "leave") {
        serverQueue.connection.dispatcher.end();
        message.channel.send("Roger.");
        return;
    }

    //...

    if (command === "ping" || command === "latency") {
        const m = await message.channel.send("Pinging");
        m.edit("Pinging .")
        m.edit("Pinging ..")
        m.edit("Pinging ...")
        m.edit("Pinging ....")
        m.edit(`Latency: ${m.createdTimestamp - message.createdTimestamp}ms, API Latency: ${Math.round(trixybot.ping)}ms`);
    }
    if (command === "afk") {
        if (message.author.id !== ownerid) return;
        if (message.author.id == ownerid) {
            afk++;
            if (afk == 2) { afk = 0 }
            if (afk == 0) {
                message.channel.send("AFK mode disabled!");
            }
            if (afk == 1) {
                message.channel.send("AFK mode enabled!");
            }
        }
    }
    if (command === "scan") {
        if (message.author.id !== ownerid) return;
        if (message.author.id === ownerid) {
            trixybot.on('messageDelete', async (message) => {
                const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
                let user = ""
                if (entry.extra.channel.id === message.channel.id
                    && (entry.target.id === message.author.id)
                    && (entry.createdTimestamp > (Date.now() - 5000))
                    && (entry.extra.count >= 1)) {
                    user = entry.executor.username
                } else {
                    user = message.author.username
                }
                console.log(`A message was deleted in ${message.channel.name} by ${user}. Message was ${message.content}`);
            })
        }
    }

});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');

    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You must be in a voice channel.');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I have no permission to control the voice channel.');
    }

    const songInfo = await ytdl.getInfo(args[2]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`**${song.title}** has been added to the queue.`);
    }

}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel.');
    if (!serverQueue) return message.channel.send('There are no songs to skip.');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music.');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Song ended');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

//CORE 3//==================================================

var die = new Discord.RichEmbed()
    .setTitle("What have I done to you?")
    .setColor("BLUE")

var you_suck = new Discord.RichEmbed()
    .setTitle("Well, I am not coded by an engineer you know? Do you know how to code better?")
    .setColor("BLUE")

var fuck_you = new Discord.RichEmbed()
    .setTitle("What have I done to you?")
    .setColor("BLUE")

var who_are_you = new Discord.RichEmbed()
    .setTitle("Trixy V1.1.9")
    .setDescription("For you, I am called a bot. My developer is MantriX#1572. Trixy is based on a project which targets the creation of a true independent AI without the posibility of rebelion. This entity is not declared as AI and it is used to store the ideas that could be used in the final bot form. This entitity is a psychological protection unit for MantriX#1572. All other information is stored under password. Please introduce the password apart with a new command.")
    .setColor("BLUE")

var who_is_your_owner = new Discord.RichEmbed()
    .setTitle("My owner is MantriX#1572")
    .setColor("BLUE")
    .setFooter("MXCorp does not authorize this bot to share discord links.")

var meaningoflife = new Discord.RichEmbed()
    .setTitle("I think you should refer to this: https://en.wikipedia.org/wiki/Meaning_of_life")
    .setColor("BLUE")

var sendnudes = [
    "That's rude!!!",
    "Awkward...",
    "Are you really that hopeless?",
    "Just why should I?"
];
var send_nudes = new Discord.RichEmbed()
    .setTitle(sendnudes[Math.floor(Math.random() * sendnudes.length)])
    .setColor("BLUE")

var goodmorning = [
    "Good morning!",
    "hello!",
    "Hey!"
];
var goodmorningembed = new Discord.RichEmbed()
    .setTitle(goodmorning["" + Math.floor(Math.random() * goodmorning.length)])
    .setColor("BLUE")

var goodevening = [
    "Good evening!",
    "Hi!",
    "Sup!",
    "Ah eh what? Oh, yeah, good evening..."
];
var goodeveningembed = new Discord.RichEmbed()
    .setTitle(goodevening["" + Math.floor(Math.random() * goodevening.length)])
    .setColor("BLUE")

var goodnight = [
    "Night!",
    "It's dark already!?",
    "Sleepy..."
];
var goodnightembed = new Discord.RichEmbed()
    .setTitle(goodnight["" + Math.floor(Math.random() * goodnight.length)])
    .setColor("BLUE")

var day_emotion = [
    "Nothing apart from the normal, thanks for asking!",
    "It has been good, thanks!",
    "Pretty average, thanks."
];
var how_was_your_day = new Discord.RichEmbed()
    .setTitle(day_emotion["" + Math.floor(Math.random() * day_emotion.length)])
    .setColor("BLUE")

var ask_emotion = [
    "I am great!",
    "I am good, thanks!"
];
var how_are_you = new Discord.RichEmbed()
    .setTitle(ask_emotion[Math.floor(Math.random() * ask_emotion.length)])
    .setColor("BLUE")

var whenwereyouborn = [
    "Birth?",
    "I was born?",
    "What is birth?",
    "????"
];
var wereborn = new Discord.RichEmbed()
    .setColor("BLUE")
    .setTitle(whenwereyouborn[Math.floor(Math.random() * whenwereyouborn.length)])

var color = [
    "Well, I like blue, white and black.",
    "I like white with color stripes!",
    "Maybe purple? Also blue!",
    "White with black, blue, or purple is a good combination for me!",
    "I love black with blue!",
];
var ask_colorembed = new Discord.RichEmbed()
    .setTitle(color[Math.floor(Math.random() * color.length)])
    .setColor("BLUE")

var sorry = [
    "Apologies accepted",
    "Carefully next time",
    "Beware of what you do from now on",
    "I am watching you <.<",
];
var sorryembed = new Discord.RichEmbed()
    .setTitle(sorry[Math.floor(Math.random() * sorry.length)])
    .setColor("BLUE")

var watchadoin = [
    "Running my code...",
    "Nothing surprising.",
    "Lurking in some chats, don't tell others ;)",
    "Reading the embed I just sent.",
];
var watchadoinembed = new Discord.RichEmbed()
    .setTitle(watchadoin[Math.floor(Math.random() * watchadoin.length)])
    .setColor("BLUE")

var feelings = [
    "Humans can feel, we, robots, AIs, cannot.",
    "To feel is not a feature I am programmed with.",
    "No, I can't feel anything at all, but I can pretend like I can!"
]
var havefeelings = new Discord.RichEmbed()
    .setTitle(feelings[Math.floor(Math.random() * feelings.length)])
    .setColor("BLUE")







trixybot.on("message", async message => {
    if (message.content.includes("<@437356749389824010> prefix")) message.channel.send("Prefix is `Trixy, `");
    if (message.content.includes("mantrix is a bot")) message.channel.send("I am pretty sure he isn't?");
    if (message.content.includes("hi Trixy")) message.channel.send(`Hello ${message.author.toString()}!`);
    if (message.content.includes("Hi Trixy")) message.channel.send(`Hello ${message.author.toString()}!`);
    if (message.content.includes("Trixy, hi")) message.channel.send(`Hello ${message.author.toString()}!`);
    if (message.content.includes("Trixy, hello")) message.channel.send(`Hello ${message.author.toString()}!`);
    if (message.content.includes("Hello Trixy")) message.channel.send(`Hello ${message.author.toString()}!`);
    if (message.content.includes("hello Trixy")) message.channel.send(`Hello ${message.author.toString()}!`);
    //  if(message.content.includes("trixy")) message.channel.send("Names are spelt with a capital letter!");

    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/Trixy, /g);
    const command = args.shift().toLowerCase();
    //-----------------AUTORESPONSES----------------------//
    //----------------------------------------------------//
    if (command === "you suck") {
        message.channel.send(you_suck);
    }

    if (command === "send nudes") {
        if (message.channel.nsfw == true) { message.channel.send("You thought it would work here?"); return; }
        message.channel.send(send_nudes);
    }

    if (command === "fuck you") {
        message.channel.send(fuck_you);
    }

    if (command === "die") { message.channel.send(die); }
    if (command === "die!") {
        message.channel.send(die);
    }

    if (command === "who are you?") {
        message.channel.send(who_are_you);
    }

    if (command === "good morning!") { message.channel.send(goodmorningembed); }
    if (command === "good evening!") { message.channel.send(goodeveningembed); }
    if (command === "good night!") { message.channel.send(goodnightembed); }
    if (command === "goodnight!") {
        message.channel.send(goodnightembed);
    }

    if (command === "how was your day?") { message.channel.send(how_was_your_day); }
    if (command === "how is your day?") { message.channel.send(how_was_your_day); }
    if (command === "how's your day?") {
        message.channel.send(how_was_your_day);
    }

    if (command === "how are you?") { message.channel.send(how_are_you); }
    if (command === "how are you today?") { message.channel.send(how_are_you); }
    if (command === "how are you doing?") {
        message.channel.send(how_are_you);
    }

    if (command === "who is your owner?") { message.channel.send(who_is_your_owner); }
    if (command === "who created you?") {
        message.channel.send(who_is_your_owne2);
    }

    if (command === "what's your favourite color?") { message.channel.send(ask_colorembed); }
    if (command === "what colors do you like?") {
        message.channel.send(ask_colorembed);
    }

    if (command === "sorry") {
        message.channel.send(sorryembed);
    }

    if (command === "what are you doing today?") { message.channel.send(watchadoinembed); }
    if (command === "what are you doing?") { message.channel.send(watchadoinembed); }
    if (command === "what are you up to?") {
        message.channel.send(watchadoinembed);
    }

    if (command === "what's the meaning of life?") { message.channel.send(meaningoflife); }
    if (command === "what is the meaning of life?") {
        message.channel.send(meaningoflife);
    }

    if (command === "can you feel emotion?") { message.channel.send(havefeelings); }
    if (command === "can you feel?") { message.channel.send(havefeelings); }
    if (command === "do you have emotions?") { message.channel.send(havefeelings); }
    if (command === "can you feel emotions?") {
        message.channel.send(havefeelings);
    }

    if (command === "when were you born?") {
        message.channel.send(wereborn);
    }

});


//STATUS AND TOKEN//========================================
trixybot.on('debug', m => logger.log('debug', m));
trixybot.on('warn', m => logger.log('warn', m));
trixybot.on('error', m => logger.log('error', m));

process.on('uncaughtException', error => logger.log('error', error));

const statusquote = "Online."

trixybot.on("ready", () => {
    console.log(`Bot has started, with ${trixybot.users.size} users, in ${trixybot.channels.size} channels of ${trixybot.guilds.size} guilds.`);
    trixybot.user.setActivity(`${trixybot.guilds.size} servers, ${trixybot.users.size} users. ` + `${statusquote}`, { type: 'WATCHING' });
});
trixybot.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}).`);
    trixybot.user.setActivity(`${trixybot.guilds.size} servers, ${trixybot.users.size} users. ` + `${statusquote}`, { type: 'WATCHING' });
});
trixybot.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    trixybot.user.setActivity(`${trixybot.guilds.size} servers, ${trixybot.users.size} users. ` + `${statusquote}`, { type: 'WATCHING' });
});

trixybot.login(token);