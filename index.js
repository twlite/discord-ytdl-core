const ytdl = require("ytdl-core");
const prism = require("prism-media");
const ytsearch = require("yt-search");
const ytsr = query =>
  new Promise((resolve, reject) =>
    ytsearch(query, (err, r) => (err ? reject(err) : resolve(r)))
  );

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

/**
 * search - searches youtube
 * @param {String} query - search query 
 */
async function fetch(query) {
    if (!query) throw new Error("No query provided");
    let res = await ytsr(query);
    return res;
}

/**
 * fetchURL - fetches video url by query
 * @param {String} query - search query
 */
async function fetchURL(query) {
    if (!query) throw new Error("No query provided");
    let data = await ytsr(query);
    let res = data.videos ? (data.videos.length ? data.videos[0].url : null) : null;
    return res;
}

module.exports = Object.assign(createOpusStream, ytdl);
module.exports.fetchURL = fetchURL;
module.exports.fetch = fetch;
