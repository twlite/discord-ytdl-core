import ytdl, { downloadOptions } from "ytdl-core";
import prism from "prism-media";

interface CreateOpusStreamOptions extends downloadOptions {
    seek?: number;
    encoderArgs?: any[];
};

/**
 * Create an opus stream for your video with provided encoder args
 * @param url - YouTube URL of the video
 * @param options - YTDL options
 */
const createOpusStream = (url: string, options: CreateOpusStreamOptions) => {
    if (!url) {
        throw new Error("No input url provided");
    }
    if (typeof url !== "string") {
        throw new SyntaxError("input URL must be a string");
    }

    let FFmpegArgs: string[] = [
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

    const transcoder = new prism.FFmpeg({
        args: FFmpegArgs
    });

    const inputStream = ytdl(url, options);
    const output = inputStream.pipe(transcoder);

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

export = Object.assign({
    createOpusStream,
    ytdl
});
