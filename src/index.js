const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');
const { regexes } = require('../credit-config.json');
const colors = require('colors');
const creditStore = require("./social-credit-store")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = "!credits";

client.once('ready', () => {
	console.log(getTime() + colors.green('Bot is Ready.'));
	console.log(getTime()+ colors.green(`Bot is logged in as ${colors.yellow(client.user.tag)}.`));
});

client.on('messageCreate', async message => {
	const { content } = message;
    if (message.author.bot) return;

	let args;
    if(content.startsWith(prefix)) {
        args = message.content.slice(prefix.length).trim().split(/\s+/);
	    const command = args.shift().toLowerCase();
        if (command === 'get') {
            if (args.length) {
                let userid = message.mentions.users.first().id;
                if(!userid) {
                    return message.channel.send(`User ${message.mentions.users.first().tag} was not found!`);
                }
                let credits = await creditStore.getCredits(userid);
                console.log(getTime() + colors.green(`${colors.yellow(args[0])} has ${colors.yellow(credits)} Social Credits!`));
                return message.channel.send(`${message.mentions.users.first().tag} has ${credits} Social Credits!`);
            }
    
            return message.channel.send(`Please provide any user.`);
        }
    }
    else {
        regexes.forEach(async element => {
            let regex = new RegExp(element.pattern);
            if(regex.exec(content)) {
                await creditStore.addCredits(message.author.id, element.points);
                console.log(getTime() + colors.green(`${colors.yellow(message.author.tag)} got ${colors.yellow(element.points)} Social Credits!`));
                return;
            }
        });
    }
});


function getTime() {
    let dateTime = new Date()
    return colors.gray(`[${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}] `);
}

client.login(token);
