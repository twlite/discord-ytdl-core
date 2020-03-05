const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js"); // discord.js v11.5.1
const client = new Discord.Client();

client.on("ready", () => {
    console.log("boom")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "??play") {
        if (!msg.member.voiceChannel) return msg.channel.send("You're not in a voice channel?");
        let input = ytdl("https://youtube.com/watch?v=7wtfhZwyrcc", {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=15']
        });

        msg.member.voiceChannel.join()
            .then(connection => {
                connection.playOpusStream(input,
                    {
                        highWaterMark: 1,
                        bitrate: 320000
                    })
            })
    }
});

client.login("TOKEN");
