# discord-ytdl-core
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

```sh
npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

# Options
This package provides 2 extra options excluding ytdl-core options.
They are: `seek` & `encoderArgs`.
- seek: This parameter takes the time in seconds. 
If this option is provided, it will return the stream from that frame.
Seek option is provided here because discord.js seek doesn't work in `ogg/opus` & `webm/opus` stream.
This option is ignored when the supplied parameter type isn't a number.

- encoderArgs: This parameter takes the Array of FFmpeg arguments.
Invalid args will throw error and crash the process.
This option is ignored when the supplied parameter type isn't array.

- Other options are the options for **[ytdl-core](https://npmjs.com/package/ytdl-core)**.

# Function fetchURL(query)
This function is async function which returns the youtube video url.
This function takes a query parameter where we can pass video names to get the url.

Example:

```js
const ytdl = require("discord-ytdl-core");

ytdl.fetchURL("Alan Walker faded").then(url => {
    VoiceConnection.play(ytdl(url), { type: "opus" });
});
```

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

# Example Bots
- **[P74Y](https://github.com/Snowflake107/P74Y)**

# Other functions
This package can do all the functions of normal **[ytdl-core](https://npmjs.com/package/ytdl-core)**.

**Special Thanks to [@Androz2091](https://github.com/Androz2091) for the help in development of this package.**

# Join our Discord Server
**[discord.gg/uqB8kxh](https://discord.gg/uqB8kxh)**
