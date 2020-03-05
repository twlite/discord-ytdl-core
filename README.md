# discord-ytdl-core
Simple ytdl wrapper for discord bots with custom ffmpeg args support.

```bash
npm i discord-ytdl-core
```

[https://www.npmjs.com/package/discord-ytdl-core](https://www.npmjs.com/package/discord-ytdl-core)

# Example

```js
const ytdl = require("discord-ytdl-core");

function playStream(connection) {
    return connection.play(ytdl("url", {
        encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=10']
    }), {
        type: 'opus'
    })
}

```

# Discord
**[Click Me](https://discord.gg/AHdaSqr)**
