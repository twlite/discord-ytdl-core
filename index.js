"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const prism_media_1 = __importDefault(require("prism-media"));
;
/**
  * Create an opus stream for your video with provided encoder args
  * @param url - YouTube URL of the video
  * @param options - YTDL options
  * @param [options.seek] seek - Time in seconds to seek
  * @param [options.encoderArgs] encoderArgs - FFmpeg encoder args
  * @returns {Stream}
  * @example const ytdl = require("discord-ytdl-core");
  * const stream = ytdl("VIDEO_URL", {
  *     seek: 3,
  *     encoderArgs: ["-af", "bass=g=20,dynaudnorm=f=200"]
  * });
  * VoiceConnection.play(stream, {
  *     type: "opus"
  * });
  */
const OpusStream = (url, options) => {
    if (!url) {
        throw new Error("No input url provided");
    }
    if (typeof url !== "string") {
        throw new SyntaxError(`input URL must be a string. Received ${typeof url}!`);
    }
    let FFmpegArgs = [
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", "s16le",
        "-ar", "48000",
        "-ac", "2"
    ];
    if (options && options.seek && !isNaN(options.seek)) {
        FFmpegArgs.unshift("-ss", options.seek.toString());
    }
    if (options && options.encoderArgs && Array.isArray(options.encoderArgs)) {
        FFmpegArgs = FFmpegArgs.concat(options.encoderArgs);
    }
    const transcoder = new prism_media_1.default.FFmpeg({
        args: FFmpegArgs
    });
    const inputStream = ytdl_core_1.default(url, options);
    const output = inputStream.pipe(transcoder);
    const opus = new prism_media_1.default.opus.Encoder({
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
const DiscordYTDLCore = Object.assign(OpusStream, ytdl_core_1.default);
module.exports = DiscordYTDLCore;
