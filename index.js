const ytdl = require("ytdl-core");
const prism = require("prism-media");

/**
 * ytdl-core
 * @param {String} url youtube url
 * @param {Object} options ytdl options
 */
function createOpusStream(url, options) {
    if (!url) throw new Error("No input url provided");
    if (typeof url !== "string") throw new SyntaxError("input URL must be a string");
    let FFmpegArgs = [
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "2",
    ];
    
    if (options && options.seek && !isNaN(options.seek)) FFmpegArgs.unshift("-ss", options.seek);
    if (options && options.encoderArgs && Array.isArray(options.encoderArgs)) FFmpegArgs = FFmpegArgs.concat(options.encoderArgs);
    let transcoder = new prism.FFmpeg({
        args: FFmpegArgs
    });
    let inputStream = ytdl(url, options);
    let output = inputStream.pipe(transcoder);
    let opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 });
    let outputStream = output.pipe(opus);
    outputStream.on('close', () => {
        transcoder.destroy();
        opus.destroy();
    });
    return outputStream;
}

module.exports = Object.assign(createOpusStream, ytdl);
