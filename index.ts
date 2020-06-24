import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";

/**
 * Stream Options
 * @param {Number} seek Time in seconds to seek
 * @param {Array} encoderArgs Args provided to transcoder
 * @param {String} fmt Output format.
 * @param {Boolean} opusEncoded It should return opus encoded stream?
 */
interface YTDLStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
    fmt?: string;
    opusEncoded?: boolean;
};

/**
 * Stream Options
 * @param {Number} seek Time in seconds to seek
 * @param {Array} encoderArgs Args provided to transcoder
 * @param {String} fmt Output format.
 * @param {Boolean} opusEncoded It should return opus encoded stream?
 */
interface StreamOptions {
    seek?: number;
    encoderArgs?: any[];
    fmt?: string;
    opusEncoded?: boolean;
};

/**
  * Create an opus stream for your video with provided encoder args
  * @param url - YouTube URL of the video
  * @param options - YTDL options
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
const StreamDownloader = (url: string, options: YTDLStreamOptions) => {
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

/**
 * Creates arbitraryStream
 * @param {String} stream Any readable stream source
 * @param {StreamOptions} options Stream options
 * @example const streamSource = "https://listen.moe/kpop/opus";
 * let stream = ytdl.arbitraryStream(streamSource, {
 *     encoderArgs: ["asetrate=44100*1.25"],
 *     fmt: "mp3"
 * });
 * 
 * stream.pipe(fs.createWriteStream("kpop.mp3"));
 */
const arbitraryStream = (stream: string, options: StreamOptions) => {
    if (!stream) {
        throw new Error("No stream source provided");
    }

    let FFmpegArgs: string[] = [
            '-reconnect', '1',
            '-reconnect_streamed', '1',
            '-reconnect_delay_max', '5',
            "-i", stream,
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

    let transcoder = new prism.FFmpeg({
        args: FFmpegArgs
    });

    if (options && !options.opusEncoded) {
        transcoder.on("close", () => transcoder.destroy());
        return transcoder;
    };
    const opus = new prism.opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    });

    const outputStream = transcoder.pipe(opus);
    outputStream.on('close', () => {
        transcoder.destroy();
        opus.destroy();
    });
    return outputStream;
};

StreamDownloader.arbitraryStream = arbitraryStream;
const DiscordYTDLCore = Object.assign(StreamDownloader, ytdl);

export = DiscordYTDLCore;