const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("boom");
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "??play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let input = ytdl("https://youtube.com/watch?v=7wtfhZwyrcc", {
            filter: "audioonly",
            encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=15']
        });

        msg.member.voice.channel.join()
            .then(connection => {
                connection.play(input,
                    {
                        type: "opus"
                    })
            })
    }
});

client.login("TOKEN");
