"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var prism_media_1 = __importDefault(require("prism-media"));
;
/**
 * Create an opus stream for your video with provided encoder args
 * @param url - YouTube URL of the video
 * @param options - YTDL options
 */
var createOpusStream = function (url, options) {
    if (!url) {
        throw new Error("No input url provided");
    }
    if (typeof url !== "string") {
        throw new SyntaxError("input URL must be a string");
    }
    var FFmpegArgs = [
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
    var transcoder = new prism_media_1["default"].FFmpeg({
        args: FFmpegArgs
    });
    var inputStream = ytdl_core_1["default"](url, options);
    var output = inputStream.pipe(transcoder);
    var opus = new prism_media_1["default"].opus.Encoder({
        rate: 48000,
        channels: 2,
        frameSize: 960
    });
    var outputStream = output.pipe(opus);
    outputStream.on('close', function () {
        transcoder.destroy();
        opus.destroy();
    });
    return outputStream;
};
var DiscordYTDLCore = Object.assign(createOpusStream, ytdl_core_1["default"]);
module.exports = DiscordYTDLCore;
