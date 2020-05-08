const ytdl = require("discord-ytdl-core");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("ready")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "??play") {
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let stream = ytdl("https://youtube.com/watch?v=ERu6jh_1gR0", {
            filter: "audioonly",
            encoderArgs: [
                '-af',
                'equalizer=f=40:width_type=h:width=50:g=10'
            ]
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            connection.play(stream, {
                type: "opus"
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
