# YTDL-DISCORD
Simple module to create bass-boosted audio for discord bots using ytdl-core.

```
npm i ytdl-discord
```

[https://www.npmjs.com/package/ytdl-discord](https://www.npmjs.com/package/ytdl-discord)

# Features
- Easy
- Custom FFmpeg args

# Example
- Stable

```js

const ytdl = require("ytdl-discord");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("boom")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "??play") { // playing bassboosted audio
        if (!msg.member.voiceChannel) return msg.channel.send("You're not in a voice channel?");
        let input = ytdl("https://youtube.com/watch?v=7wtfhZwyrcc", {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            passArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=10'] // custom ffmpeg args
        });
        
        msg.member.voiceChannel.join()
        .then(connection => {
            connection.playConvertedStream(input,
            {
                highWaterMark: 1,
                bitrate: 320000
            })
        })
    }
});

client.login("Discord_Bot_Token");

```


- Master

```js
const ytdl = require("ytdl-discord");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("boom")
});

client.on("message", msg => {
    if (msg.author.bot || !msg.guild) return;
    if (msg.content === "??play") { // playing bassboosted audio
        if (!msg.member.voice.channel) return msg.channel.send("You're not in a voice channel?");
        let input = ytdl("https://youtube.com/watch?v=7wtfhZwyrcc", {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            passArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=10'] // custom ffmpeg args
        });
        
        msg.member.voice.channel.join()
        .then(connection => {
            connection.play(input,
            {
                type: 'converted',
                highWaterMark: 1,
                bitrate: 320000
            })
        })
    }
});

client.login("Discord_Bot_Token");

```


# Discord
**[Click Me](https://discord.gg/AHdaSqr)**
