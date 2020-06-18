import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";

/**
 * Stream Options
 * @param {Number} seek Time in seconds to seek
 * @param {Array} encoderArgs Args provided to transcoder
 * @param {String} fmt Output format.
 * @param {Boolean} opusEncoded It should return opus encoded stream?
 */
interface StreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
    fmt?: string;
    opusEncoded?: boolean;
};

/**
  * Create an opus stream for your video with provided encoder args
  * @param url - YouTube URL of the video
  * @param options - YTDL options
  * @returns {Stream}
  * @example const ytdl = require("discord-ytdl-core");
  * const stream = ytdl("VIDEO_URL", {
  *     seek: 3,
  *     encoderArgs: ["-af", "bass=g=10"],
  *     opusEncoded: true
  * });
  * VoiceConnection.play(stream, {
  *     type: "opus"
  * });
  */
const OpusStream = (url: string, options: StreamOptions) => {
    if (!url) {
        throw new Error("No input url provided");
    }
    if (typeof url !== "string") {
        throw new SyntaxError(`input URL must be a string. Received ${typeof url}!`);
    }

    let FFmpegArgs: string[] = [
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", `${options && options.fmt && typeof (options.fmt) == "string" ? options.fmt : "s16le"}`,
        "-ar", "48000",
        "-ac", "2"
    ];

    if (options && options.seek && !isNaN(options.seek)) {
        FFmpegArgs.unshift("-ss", options.seek.toString());
    }

    if (options && options.encoderArgs && Array.isArray(options.encoderArgs)) {
        FFmpegArgs = FFmpegArgs.concat(options.encoderArgs);
    }

    const transcoder = new prism.FFmpeg({
        args: FFmpegArgs
    });

    const inputStream = ytdl(url, options);
    const output = inputStream.pipe(transcoder);
    if (options && !options.opusEncoded) {
        output.on("close", () => transcoder.destroy());
        return output;
    }; 
    const opus = new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    });

    const outputStream = output.pipe(opus);
    outputStream.on('close', () => {
        transcoder.destroy();
        opus.destroy();
    });
    return outputStream;
};

const DiscordYTDLCore = Object.assign(OpusStream, ytdl);

export = DiscordYTDLCore;