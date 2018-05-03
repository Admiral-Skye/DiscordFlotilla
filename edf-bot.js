const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.
const prefix = config.prefix;

var fridgeID = "220112374223339520";

const verses = [
    "To save our mother Earth from any alien attack",
    "From vicious giant insects who have once again come back",
    "We'll unleash all our forces, we won't cut them any slack",
    "The EDF deploys!",

    "Our soldiers are prepared for any alien threats",
    "The navy launches ships, the air force send their jets",
    "And nothing can withstand our fixed bayonets",
    "The EDF deploys!",

    "Our forces have now dwindled and we pull back to regroup",
    "The enemy has multiplied and formed a massive group",
    "We better beat these bugs before we're all turned to soup",
    "The EDF deploys!",
];

const secretverses = [
    "To Take Down giant insects who came from outer space",
    "We now head underground, for their path we must retrace",
    "And find their giant nest and crush the queen's carapace",
    "The EDF deploys!",

    "The air force and the navy were destroyed or cast about",
    "Scouts, rangers, wing divers have almost been wiped out",
    "Despite all this the infantry will stubbornly hold out",
    "The EDF deploys!",

    "Our friends were all killed yesterday, as were our families",
    "Today we might not make it, facing these atrocities",
    "We'll never drop our banner despite our casualties",
    "The EDF deploys!",

    "Two days ago my brother died, next day my lover fell",
    "Today most everyone was killed, on that we must not dwell",
    "But we will never leave the field, we'll never say farewell",
    "The EDF deploys!",

    "A legendary hero soon will lead us to glory",
    "Eight years ago he sunk the mothership says history",
    "Tomorrow we will follow this brave soul to victory",
    "The EDF deploys!"
];

client.on("ready", () => {
    console.log("I am ready!");

    //client.guilds.get("214382586951106571").channels.get("425501170988220438").send("The EDF Deploys");
});

client.on("message", (message) => {
    var msg = message.content.toLowerCase();
    
	if (msg.startsWith(prefix + "roll")) {
		var indic = extractDice(msg);
        if (indic == undefined) {
            message.channel.send("\u200BIncorrect usage, correct usage: ~sing [verse]:[line]");
        } else {
			var number = indic[0];
			var sides = indic[1];
			
            var rolls = [];
            var sum = 0;
			
			for (var i = 0; i < number; i++) {
                var roll = Math.floor(Math.random() * sides) + 1;
                sum += roll;
                if (roll == sides) {
                    rolls.push("Natural mutha fuckin " + sides);
                } else {
                    rolls.push(roll);
                }
            }
            var msgstr = "\u200BYou rolled " + sum + ", your rolls were: \n`";

            for (let roll of rolls) {
                msgstr += " [" + roll + "]";
            }

            msgstr += "`";
            message.channel.send(msgstr);

		}
	}

    if (msg.startsWith(prefix + "remember")) {
        var mem = msg.substring(9);
        console.log("remembering " + mem);

        fs.writeFile('mem.txt', mem, 'utf8', function writeFileCallback(err) {});

        message.channel.send("\u200BI will remember `" + mem + "`");
    }
    
    if (msg.startsWith(prefix + "recall")) {
        fs.readFile('mem.txt', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {

                message.channel.send("\u200BI remembered`" + data + "`");

                /*
                obj = JSON.parse(data); //now it an object
                obj.table.push({ id: 2, square: 3 }); //add some data
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
                */
            }
        });
    }

    var i = 0, j = 1;
    if (msg.startsWith(prefix + "verses")) {
        var str = "Verses:";

        for (let verse of verses) {
            i++;
            if (i > 4) {
                j++
                i = 1;
                str += "\n";
            }

            str = str + "\n [" + j + ":" + i + "] " + verse;
        }
        message.channel.send("\u200B```" + str + "```")
    }

    if (msg.startsWith(prefix + "sing")) {
        var indic = extractNumbers(msg);
        if (indic == undefined) {
            message.channel.send("\u200BIncorrect usage, correct usage: ~sing [verse]:[line]");
        } else if (indic[1] > 4) {
            message.channel.send("\u200BThere's only 4 lines to a verse!");
        }else {
            var line = (indic[0] - 1) * 4 + indic[1];
            if (line > 32) {
                message.channel.send("\u200BI don't know that one!");
            }
            else if (line < 13) {
                message.channel.send("\u200B" + verses[line - 1] + ":musical_note:");
            } else {
                message.channel.send("\u200B" + secretverses[line - 13] + ":musical_note:");
            }
        }

    }

    //check if singing a verse
    if (msg.startsWith(prefix + "the edf deploys")) {
        message.channel.send("\u200BThe EDF deploys!:musical_note:");
    } else {
        var k = 0;
        for (let verse of verses) {
            if (msg.startsWith(prefix + verse.toLowerCase())) {
                message.channel.send("\u200B" + verses[k + 1] + ":musical_note:");
            } else {
                i++;
            }
        }
    }
});

function extractNumbers(str) {
    var m = /(\d+):(\d+)/.exec(str);
    return m ? [+m[1], +m[2]] : null;
}

function extractDice(str) {
    var m = /(\d+)d(\d+)/.exec(str);
    return m ? [+m[1], +m[2]] : null;
}


client.login(config.token);
