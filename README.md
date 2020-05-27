# [discord-ytdl-core](https://discord-ytdl-core.netlify.app "Documentation")
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

# Documentation
**[Discord YTDL Core](https://discord-ytdl-core.netlify.app "Discord YTDL Core documentation site")**

# Installing

```sh
npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

> Please install an Opus engine & FFmpeg before using this package.

## **Supported Opus Engines:**
- **[@discordjs/opus](https://npmjs.com/package/@discordjs/opus)** - Best performance
- **[node-opus](https://npmjs.com/package/node-opus)** - Deprecated
- **[opusscript](https://npmjs.com/package/opusscript)**

# Options
This package provides 2 extra options excluding ytdl-core options.
They are: `seek` & `encoderArgs`.
- seek: This parameter takes the time in seconds. 
If this option is provided, it will return the stream from that frame.
Seek option is provided here because discord.js seek doesn't work for `ogg/opus` & `webm/opus` stream.
This option is ignored when the supplied parameter type isn't a number.

- encoderArgs: This parameter takes the Array of FFmpeg arguments.
Invalid args will throw error and crash the process.
This option is ignored when the supplied parameter type isn't array. Invalid FFmpeg args might crash the process.

- Other options are the options for **[ytdl-core](https://npmjs.com/package/ytdl-core)**.

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
            encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=10'] // FFmpeg args array (optional)
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

> **If you have a bot which uses this package, create a Pull Request.**


# Other functions
This package can do all the functions of normal **[ytdl-core](https://npmjs.com/package/ytdl-core)**.

# Related
- **[ytdl-core-discord](https://npmjs.com/package/ytdl-core-discord)**
- **[discord-player](https://npmjs.com/discord-player)**

# Developers
- **[@Snowflake107](https://github.com/Snowflake107)** - Initial (JS)
- **[@Androz2091](https://github.com/Androz2091)** - Rewrite (TS)

# Join our Official Discord Server
- **[Snowflake Development ❄️](https://discord.gg/uqB8kxh)**
- **[AndrozDev](https://discord.gg/Qreejcu)**

