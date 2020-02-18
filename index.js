const ytdl = require("ytdl-core");
const prism = require("prism-media");

/**
 * ytdl-core
 * @param {String} url youtube url
 * @param {Object} options ytdl options
 */
function convertStream(url, options) {
    if (!url) throw new Error("No input url provided");
    if (typeof url !== "string") throw new SyntaxError("input URL must be a string");
    let FFmpegArgs = [
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "2",
    ];
    if (options.passArgs && Array.isArray(options.passArgs)) FFmpegArgs = FFmpegArgs.concat(options.passArgs);
    let transcoder = new prism.FFmpeg({
        args: FFmpegArgs
    });
    let inputStream = ytdl(url, options);
    let output = inputStream.pipe(transcoder);
    return output;
}

module.exports = Object.assign(convertStream, ytdl);
