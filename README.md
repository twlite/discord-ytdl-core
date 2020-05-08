# discord-ytdl-core
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

```sh
npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

# Example

```js
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
            ] // FFmpeg args array (optional)
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            connection.play(stream, {
                type: "opus" // type: opus is compulsory because this package returns opus stream
            })
            .on("finish", () => {
                msg.guild.me.voice.channel.leave();
            })
        });
    }
});

client.login("TOKEN");
```

**Special Thanks to [@Androz2091](https://github.com/Androz2091) for the help in development of this package.**

# Join our Discord Server
**[discord.gg/uqB8kxh](https://discord.gg/uqB8kxh)**
