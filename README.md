# discord-ytdl-core
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

```sh
npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

# Example

```js
const ytdl = require("discord-ytdl-core");
const client = new (require("discord")).Client();

client.on("ready", () => console.log("Online!"));

function playStream(connection, url) {
    return connection.play(ytdl(url, {
        encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=10'] // bassboost (ffmpeg args)
    }), {
        type: 'opus' // play as opus
    })
}

client.on("message", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (message.content.startsWith("?p")) {
       let connection = await message.member.voice.channel.join();
       return playStream(connection, "video_url");
    }

client.login("TOKEN");
```

# Discord
**[Click Here](https://discord.gg/uqB8kxh)** to join our discord server.
